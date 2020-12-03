import * as React from 'react';
import * as H from 'history';
import { Formik } from 'formik';
import cx from 'classnames';
import * as Yup from 'yup';
import themr from 'src/helpers/themr';
import { Accordion, Grid, Icon } from 'semantic-ui-react';
import urls from 'src/helpers/urls';
import Heading, { HeadingType, HeadingColor } from 'src/components/Heading';
import Button, {
  ButtonType,
  ButtonColor,
  ButtonWeight,
} from 'src/components/Button';
import idx from 'idx';
import * as moment from 'moment';
import {
  IReaderItem,
  IGroupReader,
  IOrganizerGroup,
} from 'src/store/types/common';
import { confirmModal } from 'src/components/Modal/ConfirmationModal';
import tableStyles from 'src/components/Table/styles.scss';
import Input from 'src/components/FormFields/Input';
import UpdateReaderModal from 'src/components/Modal/UpdateReaderModal';
import PencilIcon from 'src/assets/icons/pencil.svg';
import Checkbox from 'src/components/FormFields/Checkbox';
import styles from '../styles.scss';
import ProgressDetail from '../Progress/Detail';
import ProgressPercentage from '../Progress/Percentage';

export type Props = IComponentProps & {
  group: IOrganizerGroup;
  reader: IGroupReader;
  history: H.History;
  onPlusIconClick: Function;
  isActive: boolean;
  onDeleteReader: Function;
  isDeleting: boolean;
  onUpdateReader: Function;
  isUpdating: boolean;
  completionProgress?: number;
  onOpenNoteModal?: Function;
  readerLoading?: boolean;
  onOpenEntryModal?: Function;
  readingLogProgress?: any;
  readingLog?: boolean;
  applyCheckAll?: boolean;
  checkAll?: boolean;
  eachCheck?: Function;
  readersCheck?: any[];
  accessGroupByProgram?: any;
  onListReadersRefresh: Function;
  programId?: string;
  groupId?: string;
};

interface ReaderRowState {
  isOpenUpdateModal: boolean;
  updatingReader: IReaderItem | null;
}

class ReaderRow extends React.Component<Props, ReaderRowState> {
  state = {
    isOpenUpdateModal: false,
    updatingReader: null,
  };

  goToReaderDetails = () => {
    const { history, group, reader } = this.props;
    history.push(
      urls.READER_DETAIL({
        programId: group.attributes.program_id.toString(),
        groupId: group.id,
        readerId: reader.id,
      })
    );
  };

  setUpdatingReader = (reader: IGroupReader) => {
    const readerItem: IReaderItem = {
      user_id: idx(reader, x => Number(x.id)),
      first_name: idx(reader, x => x.attributes.first_name),
      last_name: idx(reader, x => x.attributes.last_name),
      email: idx(reader, x => x.attributes.email),
      role: idx(reader, x => x.attributes.role),
    };

    this.toggleUpdateModal();
    this.setState({ updatingReader: readerItem });
  };

  toggleUpdateModal = () => {
    this.setState(state => ({
      isOpenUpdateModal: !state.isOpenUpdateModal,
      updatingReader: null,
    }));
  };

  render() {
    const {
      classes,
      isActive,
      group,
      reader,
      onPlusIconClick,
      isUpdating,
      onUpdateReader,
      onDeleteReader,
      isDeleting,
      completionProgress = 0,
      readerLoading,
      onOpenEntryModal,
      onOpenNoteModal,
      readingLogProgress,
      readingLog,
      checkAll,
      applyCheckAll,
      readersCheck,
      eachCheck,
      onListReadersRefresh,
      accessGroupByProgram,
      programId,
      groupId,
    } = this.props;
    const { isOpenUpdateModal, updatingReader } = this.state;

    // const isReadingLog = idx(group, x => x.attributes.reading_log);
    const readerCheck = readersCheck.find(r => r.id === reader.id) || {};
    return (
      <div
        className={cx(
          classes.mainStyles.rowStyle,
          classes.tableStyles.tableRowReuse,
          { [classes.tableStyles.tableRowReuseActive]: isActive }
        )}>
        <Formik
          enableReinitialize
          initialValues={{
            first_name: idx(reader, x => x.attributes.first_name),
            last_name: idx(reader, x => x.attributes.last_name),
          }}
          onSubmit={values => {
            onUpdateReader(group.id, values);
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required('Name is required'),
          })}>
          {formProps => {
            const { values } = formProps;
            const firstName = idx(reader, x => x.attributes.first_name);
            const lastName = idx(reader, x => x.attributes.last_name);
            const readerType = idx(
              reader,
              x => x.relationships.roles.data[0].id
            );
            const lastEntry = idx(reader, x => x.lastEntry.attributes.date)
              ? moment(idx(reader, x => x.lastEntry.attributes.date))
              : '';
            return (
              <form
                className={cx(
                  classes.mainStyles.formAccordion,
                  classes.mainStyles.formAccordionReader,
                  {
                    [classes.mainStyles.isActiveAccordion]: isActive,
                  }
                )}
                onSubmit={formProps.handleSubmit}>
                <Accordion.Title
                  active={isActive}
                  className={classes.mainStyles.accordionTitle}>
                  <div
                    onClick={() => {
                      this.setUpdatingReader(reader as IGroupReader);
                    }}
                    className={classes.tableStyles.hoverPencilIcon}>
                    <PencilIcon height={15} width={15} />
                  </div>
                  <Grid
                    className={classes.mainStyles.accordionGrid}
                    padded
                    verticalAlign="middle">
                    {isActive ? (
                      <Grid.Column
                        width={4}
                        className={
                          isActive ? classes.mainStyles.smallInput : ''
                        }>
                        <div style={{ display: 'flex' }}>
                          <div
                            className={cx(
                              classes.mainStyles.field,
                              classes.mainStyles.firstField,
                              classes.mainStyles.flex1
                            )}>
                            <Input
                              inputProps={{
                                name: 'first_name',
                                value: values.first_name,
                                disabled: !accessGroupByProgram.write,
                                onChange: (_, { value }) => {
                                  formProps.setFieldValue('first_name', value);
                                },
                              }}
                            />
                          </div>
                          <div
                            className={cx(
                              classes.mainStyles.field,
                              classes.mainStyles.flex1
                            )}>
                            <Input
                              inputProps={{
                                name: 'last_name',
                                value: values.last_name,
                                disabled: !accessGroupByProgram.write,
                                onChange: (_, { value }) => {
                                  formProps.setFieldValue('last_name', value);
                                },
                              }}
                            />
                          </div>
                        </div>
                      </Grid.Column>
                    ) : (
                      <>
                        <Grid.Column width={2} onClick={this.goToReaderDetails}>
                          <Heading
                            headingProps={{ as: 'h5' }}
                            type={HeadingType.BOLD_500}>
                            {firstName}
                          </Heading>
                        </Grid.Column>
                        <Grid.Column width={2} onClick={this.goToReaderDetails}>
                          <Heading
                            headingProps={{ as: 'h5' }}
                            type={HeadingType.BOLD_500}>
                            {lastName}
                          </Heading>
                        </Grid.Column>
                      </>
                    )}
                    <Grid.Column width={2} onClick={this.goToReaderDetails}>
                      <Heading
                        headingProps={{ as: 'h5' }}
                        type={HeadingType.BOLD_500}
                        colorVariant={HeadingColor.GRAY}>
                        {readerType}
                      </Heading>
                    </Grid.Column>
                    <Grid.Column width={2} onClick={this.goToReaderDetails}>
                      <Heading
                        headingProps={{ as: 'h5' }}
                        type={HeadingType.BOLD_500}
                        colorVariant={
                          moment().isSame(lastEntry) && HeadingColor.PRIMARY
                        }>
                        {lastEntry
                          ? moment(lastEntry).format('MM/DD/YYYY')
                          : '--/--/----'}
                      </Heading>
                    </Grid.Column>
                    <Grid.Column
                      width={accessGroupByProgram.write ? 4 : 6}
                      onClick={this.goToReaderDetails}>
                      <Grid verticalAlign="middle">
                        {readingLog ? (
                          <ProgressDetail
                            readingLogProgress={readingLogProgress}
                          />
                        ) : (
                          <ProgressPercentage
                            completionProgress={completionProgress}
                          />
                        )}
                      </Grid>
                    </Grid.Column>
                    {accessGroupByProgram.write && (
                      <Grid.Column width={2}>
                        <Grid verticalAlign="middle">
                          <div style={{ paddingLeft: '1.75rem' }}>
                            <Checkbox
                              center
                              checkboxProps={{
                                checked: applyCheckAll
                                  ? checkAll
                                  : readerCheck.checked,
                                onChange: (_, data: any) => {
                                  eachCheck(reader.id, data.checked);
                                },
                              }}
                            />
                          </div>
                        </Grid>
                      </Grid.Column>
                    )}
                    <Grid.Column
                      width={2}
                      textAlign="right"
                      verticalAlign="top">
                      {isActive && formProps.dirty && (
                        <Button
                          buttonType={ButtonType.ROUND}
                          buttonWeight={ButtonWeight._500}
                          colorVariant={ButtonColor.SUCCESS_FADE}
                          buttonProps={{
                            size: 'tiny',
                            loading: isUpdating,
                            type: 'submit',
                            onClick: () => {
                              onUpdateReader(group.id, formProps.values);
                            },
                          }}>
                          Save
                        </Button>
                      )}
                      {!isActive && (
                        <Icon
                          name="plus"
                          className={cx(
                            classes.mainStyles.plusIcon,
                            classes.mainStyles.plusIconReader
                          )}
                          onClick={() => onPlusIconClick(reader.id)}
                        />
                      )}
                      {isActive && !formProps.dirty && (
                        <Icon
                          name="minus"
                          className={classes.mainStyles.plusIcon}
                          onClick={() => onPlusIconClick('')}
                        />
                      )}
                    </Grid.Column>
                  </Grid>
                </Accordion.Title>
                <Accordion.Content active={isActive}>
                  {accessGroupByProgram.write && (
                    <Grid verticalAlign="middle">
                      <Grid.Row>
                        <Grid.Column width={10} verticalAlign="bottom">
                          <div
                            className={cx(
                              classes.mainStyles.inlineBlock,
                              classes.mainStyles.marginRight1
                            )}>
                            <Button
                              buttonType={ButtonType.ROUND}
                              buttonWeight={ButtonWeight._500}
                              colorVariant={ButtonColor.SECONDARY}
                              icon={<Icon name="plus circle" size="large" />}
                              buttonProps={{
                                size: 'tiny',
                                type: 'button',
                                onClick: () => {
                                  onOpenEntryModal(reader);
                                },
                              }}>
                              Add Entry
                            </Button>
                          </div>
                          <div className={classes.mainStyles.inlineBlock}>
                            <Button
                              buttonType={ButtonType.ROUND}
                              buttonWeight={ButtonWeight._500}
                              colorVariant={ButtonColor.SECONDARY}
                              icon={<Icon name="plus circle" size="large" />}
                              buttonProps={{
                                size: 'tiny',
                                type: 'button',
                                loading: readerLoading,
                                onClick: () => {
                                  onOpenNoteModal(reader);
                                },
                              }}>
                              Add Note
                            </Button>
                          </div>
                        </Grid.Column>
                        <Grid.Column
                          width={6}
                          textAlign="right"
                          className={classes.mainStyles.removeButton}
                          verticalAlign="bottom">
                          <Grid.Row textAlign="right" verticalAlign="bottom">
                            <Button
                              buttonType={ButtonType.ROUND}
                              buttonWeight={ButtonWeight._500}
                              colorVariant={ButtonColor.DANGER_FADE}
                              icon={
                                <Icon
                                  name="trash alternate outline"
                                  size="large"
                                />
                              }
                              buttonProps={{
                                size: 'tiny',
                                onClick: () => {
                                  confirmModal.open({
                                    message:
                                      'Are you sure you want to delete reader?',
                                    onOkClick: () => {
                                      onDeleteReader({
                                        groupId: group.id,
                                        goalId: group.attributes.active_goal_id,
                                        readerId: reader.id,
                                      });
                                    },
                                  });
                                },
                                loading: isDeleting,
                              }}>
                              Remove From Group
                            </Button>
                          </Grid.Row>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  )}
                </Accordion.Content>
              </form>
            );
          }}
        </Formik>
        {updatingReader && (
          <UpdateReaderModal
            modelProps={{
              closeIcon: true,
              open: isOpenUpdateModal,

              onClose: this.toggleUpdateModal,
            }}
            onDeleteReader={() => {
              confirmModal.open({
                message: 'Are you sure you want to delete reader?',
                onOkClick: () => {
                  onDeleteReader({
                    groupId: group.id,
                    goalId: group.attributes.active_goal_id,
                    readerId: reader.id,
                  });
                  this.toggleUpdateModal();
                },
              });
            }}
            programId={programId}
            groupId={groupId}
            onListReadersRefresh={onListReadersRefresh}
            onCancel={this.toggleUpdateModal}
            reader={updatingReader}
          />
        )}
      </div>
    );
  }
}

export default themr<Props>('ReaderRow', { mainStyles: styles, tableStyles })(
  ReaderRow
);
