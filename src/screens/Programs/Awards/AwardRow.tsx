import * as React from 'react';
import { Grid, Icon, Loader } from 'semantic-ui-react';
import cx from 'classnames';
import themr from 'src/helpers/themr';
import { confirmModal } from 'src/components/Modal/ConfirmationModal';
import Input from 'src/components/FormFields/Input';
import AwardSvg from 'src/assets/icons/award.svg';
import Checkbox from 'src/components/FormFields/Checkbox';
import { Formik } from 'formik';
import toast from 'src/helpers/Toast';
import Const from 'src/helpers/const';
import * as Yup from 'yup';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import styles from './styles.scss';

export type Props = IComponentProps & {
  data?: any;
  lessOpacity?: boolean;
  onEditRow?: Function;
  onPreviewClick?: Function;
  onSubmitEditRow?: Function;
  onSubmitRestore?: Function;
  editRowStatus?: string;
  onUpdateAvatar: Function;
  onDeleteAvatar: Function;
  avatarLoading?: boolean;
  match?: any;
  programId: string;
  groupId?: string;
  updateAwardAvatarSuccess: boolean;
  userAccessProgram?: any;
  isDuplicateQuantity?: Function;
};

class AwardRow extends React.Component<Props> {
  state = {
    isEditMode: false,
    file: null,
    src: '',
  };

  fileInputRef = React.createRef<HTMLInputElement>();

  imgRef = React.createRef<HTMLImageElement>();

  toggleEditMode = () => {
    const { onEditRow, data } = this.props;
    const { isEditMode } = this.state;
    if (isEditMode) {
      // if already in edit mode, then cancel edit mode
      onEditRow(null);
      this.setState({
        src: '',
        file: null,
      });
    } else {
      // if not already in edit mode, then turn on edit mode
      onEditRow(data.id);
    }
    this.setState({
      isEditMode: !isEditMode,
    });
  };

  handleUpdateAwards = (formPropsValue): void => {
    const { isDuplicateQuantity, data } = this.props;
    const description = get(formPropsValue, 'description', '');
    const quantity = get(formPropsValue, 'quantity', '');
    const currentSlug = `${quantity}_${(data.slug || '').split('_')[1]}`;
    const visibility = get(formPropsValue, 'visibility', '');
    const { file } = this.state;
    const formData = new FormData();
    if (file) {
      formData.append('avatar', file);
    } else {
      formData.append('avatar', '');
    }
    formData.append('description', description);
    formData.append('visible', (visibility ? 1 : 0).toString());
    if (!data.editable) {
      this.handleSubmitEditRow(data.id, formData);
    } else if (!isDuplicateQuantity(data.id, currentSlug)) {
      formData.append('qty', quantity);
      this.handleSubmitEditRow(data.id, formData);
    } else {
      toast.error(
        'The award quantity you entered already exists. Choose a different quantity for that award that does not already exist.'
      );
    }
  };

  handleSubmitEditRow = (id, formData) => {
    const { onSubmitEditRow } = this.props;
    onSubmitEditRow(id, formData, () => {
      this.setState({
        src: '',
        file: null,
      });
    });
  };

  componentDidUpdate = prevProps => {
    const { editRowStatus, onEditRow, updateAwardAvatarSuccess } = this.props;
    if (
      editRowStatus === 'success' &&
      editRowStatus !== prevProps.editRowStatus
    ) {
      onEditRow(null);
      this.setState({
        isEditMode: false,
      });
    }
    if (
      updateAwardAvatarSuccess &&
      updateAwardAvatarSuccess !== prevProps.updateAwardAvatarSuccess
    ) {
      this.setState({
        src: '',
        file: null,
      });
    }
  };

  checkAccessPermission = () => {
    const { userAccessProgram, programId, groupId } = this.props;
    const accessProgram = get(userAccessProgram, `program[${programId}]`, {});
    const accessGroupByProgram = get(
      userAccessProgram,
      `group_by_program[${programId}][${groupId}]`,
      {}
    );

    return groupId ? accessGroupByProgram : accessProgram;
  };

  renderForm = formProps => {
    const { data, classes, onPreviewClick } = this.props;
    const { isEditMode } = this.state;
    const {
      touched = {},
      errors = {},
      setFieldValue,
      values,
      setFieldTouched,
    } = formProps;
    const accessRight = this.checkAccessPermission();
    const isGoalGroup = data.slug.includes('reading');

    return (
      <>
        <Grid.Column
          verticalAlign="middle"
          width={4}
          className={cx(
            classes.rowColumn,
            isEditMode && classes.titleCol,
            touched.quantity && errors.quantity && classes.inputError
          )}>
          {!isEditMode || !data.editable ? (
            data.title
          ) : (
            <>
              <Input
                inputProps={{
                  onChange: (_, { value }) => {
                    if (isGoalGroup) {
                      if (
                        (Const.NUMBER_DECIMAL_PATTERN.test(value) ||
                          (value.includes('.') &&
                            (value || '').split('.').length === 2) ||
                          !value) &&
                        value !== '.'
                      ) {
                        setFieldValue('quantity', value);
                        setFieldTouched('quantity');
                      }
                    } else if (Const.NUMBER_PATTERN.test(value) || !value) {
                      setFieldValue('quantity', value);
                      setFieldTouched('quantity');
                    }
                  },
                  value: values.quantity,
                  className: cx(classes.quantityInput, classes.inputField),
                }}
                errorMessage={touched.quantity && errors.quantity}
              />
              {isGoalGroup && '% '}
              {data.title
                .split(' ')
                .filter((w, i) => i > 0)
                .join(' ')}
            </>
          )}
        </Grid.Column>
        <Grid.Column
          verticalAlign="middle"
          width={5}
          className={cx(
            classes.rowColumn,
            touched.description && errors.description && classes.inputError
          )}>
          {!isEditMode ? (
            data.description
          ) : (
            <Input
              inputProps={{
                placeholder: 'Description',
                onChange: (_, { value }) => {
                  setFieldValue('description', value);
                  setFieldTouched('description');
                },
                value: values.description,
                className: classes.inputField,
              }}
              errorMessage={touched.description && errors.description}
            />
          )}
        </Grid.Column>
        <Grid.Column
          verticalAlign="middle"
          width={2}
          className={classes.rowColumn}>
          {!isEditMode ? (
            <Checkbox
              checkboxProps={{
                checked: values.visibilityView,
                toggle: true,
                disabled: true,
                name: 'visibilityView',
              }}>
              <span className={classes.checkboxLabel}>
                {values.visibilityView ? 'Show' : 'Hide'}
              </span>
            </Checkbox>
          ) : (
            <Checkbox
              checkboxProps={{
                checked: values.visibility,
                toggle: true,
                onChange: (_, { checked }) => {
                  setFieldValue('visibility', checked);
                },
                name: 'visibility',
              }}>
              <span className={classes.checkboxLabel}>
                {values.visibility ? 'Show' : 'Hide'}
              </span>
            </Checkbox>
          )}
        </Grid.Column>
        <Grid.Column
          verticalAlign="middle"
          width={3}
          className={classes.rowColumn}>
          <div className={classes.actions}>
            <Icon
              name="eye"
              className={classes.item}
              onClick={onPreviewClick}
            />
            {accessRight.write ? (
              isEditMode ? (
                <Icon
                  name="save outline"
                  className={cx(classes.item, classes.saveIcon)}
                  onClick={() => {
                    if (isEmpty(errors)) {
                      this.handleUpdateAwards(values);
                    }
                  }}
                />
              ) : (
                <Icon
                  name="pencil alternate"
                  className={classes.item}
                  onClick={this.toggleEditMode}
                />
              )
            ) : null}
            {accessRight.write ? (
              isEditMode ? (
                <Icon
                  name="ban"
                  className={cx(classes.item, classes.banIcon)}
                  onClick={this.toggleEditMode}
                />
              ) : (
                <Icon
                  name="history"
                  className={classes.item}
                  onClick={() => {
                    confirmModal.open({
                      message:
                        'Are you sure you want to restore defaults award?',
                      okButtonText: 'Yes',
                      cancelButtonText: 'No',
                      onOkClick: this.props.onSubmitRestore,
                    });
                  }}
                />
              )
            ) : null}
          </div>
        </Grid.Column>
      </>
    );
  };

  handleChooseFile = () => {
    if (this.fileInputRef && this.fileInputRef.current) {
      this.fileInputRef.current.click();
    }
  };

  fileChange = e => {
    const files = e.target.files || [];
    const file = files[0] || null;
    if (file.size <= Const.AWARD_IMG_MAX_SIZE) {
      this.setState({ file }, () => {
        if (this.state.file) {
          const reader = new FileReader();
          reader.onload = () => {
            this.setState({
              src: reader && reader.result ? reader.result.toString() : '',
            });
          };
          reader.readAsDataURL(this.state.file);
        }
      });
    } else {
      toast.error(
        'The image you tried to upload is too large. The file size should be smaller than 2MBs. Square images work best. Recommended size is 215 x 215 pixels. Please try again.'
      );
    }
  };

  render() {
    const { classes, data, lessOpacity, avatarLoading, programId } = this.props;
    const { isEditMode, src, file } = this.state;
    const initialValues = {
      title: data ? data.title : '',
      description: data ? data.description : '',
      quantity: data ? data.qty : '',
      visibility: data.visible === 1,
      visibilityView: data.visible === 1,
      editable: data.editable,
    };
    const isDefaultAvatar = get(data, 'is_default_avatar');
    return (
      <>
        <Grid
          columns="4"
          className={cx(classes.row, { [classes.lessOpacity]: lessOpacity })}>
          <Grid.Column
            verticalAlign="middle"
            width={2}
            className={classes.rowColumn}>
            <div className={classes.imageWrapper}>
              <div
                style={{ position: 'relative' }}
                className={classes.imageInner}>
                <div className={classes.avatarLoading}>
                  {avatarLoading && (
                    <Loader
                      active
                      inline
                      size="small"
                      className="inline-loader"
                    />
                  )}
                </div>
                {data.avatar_url ? (
                  <div>
                    <img
                      src={src || data.avatar_url}
                      alt="avatar"
                      style={{ height: '50px' }}
                      ref={this.imgRef}
                    />
                  </div>
                ) : (
                  <AwardSvg height={40} />
                )}
              </div>
              {isEditMode && (
                <>
                  <div>
                    <div
                      className={cx(classes.uploadText)}
                      onClick={this.handleChooseFile}>
                      Upload New
                    </div>
                    <input
                      ref={this.fileInputRef}
                      className={classes.activityIcons}
                      type="file"
                      id="award-avatar"
                      hidden
                      onChange={this.fileChange}
                    />
                    <div
                      className={cx(
                        classes.removeText,
                        isDefaultAvatar && !src ? classes.txtDisabled : ''
                      )}
                      onClick={() => {
                        if (!avatarLoading && (!isDefaultAvatar || src)) {
                          confirmModal.open({
                            message: `Do you want to delete this avatar?`,
                            okButtonText: 'Delete',
                            cancelButtonText: 'Cancel',
                            onOkClick: () => {
                              if (src || file) {
                                this.setState({
                                  src: '',
                                  file: null,
                                });
                                this.fileInputRef.current.value = '';
                              } else {
                                this.props.onDeleteAvatar(
                                  programId,
                                  data.group_id,
                                  data.id
                                );
                              }
                            },
                          });
                        }
                      }}>
                      Remove
                    </div>
                  </div>
                </>
              )}
            </div>
          </Grid.Column>
          <Formik
            initialValues={initialValues}
            onSubmit={this.handleUpdateAwards}
            enableReinitialize
            validationSchema={Yup.object().shape({
              // title: Yup.string().required('Title required'),
              description: Yup.string().required('Description Required!'),
              quantity: Yup.number().when('editable', editable => {
                return editable === 1
                  ? Yup.number()
                      .required('Quantity Required and Greater than 2!')
                      .min(2, 'Quantity Required and Greater than 2!')
                  : Yup.number().nullable();
              }),
            })}
            render={this.renderForm}
          />
        </Grid>
      </>
    );
  }
}

export default themr<Props>('AwardRow', styles)(AwardRow);
