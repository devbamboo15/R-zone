import * as React from 'react';
import * as H from 'history';
import { Formik } from 'formik';
import cx from 'classnames';
import * as Yup from 'yup';
import { Accordion, Grid, Icon } from 'semantic-ui-react';
import { IProgram } from 'src/store/types/organizer/program';
import urls from 'src/helpers/urls';
import { formatNumber } from 'src/helpers/number';
import EnvelopeSvg from 'src/assets/icons/envelope.svg';
import MedalSvg from 'src/assets/icons/medal.svg';
import EditorSvg from 'src/assets/icons/editor.svg';
import Heading, { HeadingType, HeadingColor } from 'src/components/Heading';
import Button, { ButtonType, ButtonColor } from 'src/components/Button';
import Input from 'src/components/FormFields/Input';
import themr from 'src/helpers/themr';
import { confirmModal } from 'src/components/Modal/ConfirmationModal';
import idx from 'idx';
import Modal from 'src/components/Modal';
import ProgramCode from 'src/components/ProgramCode';
import * as Api from 'src/api';
import toast from 'src/helpers/Toast';
import tableStyles from 'src/components/Table/styles.scss';
import get from 'lodash/get';
import find from 'lodash/find';
import styles from './styles.scss';
import ProgressDetail from './Progress/Detail';
import ProgressPercentage from './Progress/Percentage';

export type Props = IComponentProps & {
  program: IProgram;
  history: H.History;
  onPlusIconClick: Function;
  isActive: boolean;
  onDeleteProgram: Function;
  isDeleting: boolean;
  onUpdateProgram: Function;
  getAllPrograms?: Function;
  isUpdating: boolean;
  completionProgress?: number;
  readingLogProgress?: any;
  userAccessProgram: any;
};

const readingLogOptions = [
  {
    text: 'Goal Based',
    value: 0,
  },
  {
    text: 'Reading Log',
    value: 1,
  },
  {
    text: 'Group vs. Group',
    value: 2,
  },
  {
    text: 'Reader vs. Reader',
    value: 3,
  },
];

class ProgramRow extends React.Component<Props> {
  state = {
    isEmailCodeModalOpen: false,
    copySuccess: '',
  };

  gotoGroups = id => {
    const { history } = this.props;
    history.push(urls.GROUPS({ programId: id }));
  };

  toggleEmailCodeModal = () => {
    const { isEmailCodeModalOpen } = this.state;
    this.setState({
      isEmailCodeModalOpen: !isEmailCodeModalOpen,
    });
  };

  doSendEmailCode = async (values, actions) => {
    const { program } = this.props;
    try {
      actions.setSubmitting(true);
      await Api.sendEmailCode(
        idx(program, x => x.attributes.code),
        values.email
      );
      toast.success('Email Code Send Successfully');
      actions.setSubmitting(false);
      this.toggleEmailCodeModal();
    } catch (error) {
      actions.setSubmitting(false);
    }
  };

  renderEmailCodeModal = () => {
    const { isEmailCodeModalOpen } = this.state;
    const { classes } = this.props;
    return (
      <Modal
        modelProps={{
          open: isEmailCodeModalOpen,
          closeIcon: true,
          onClose: this.toggleEmailCodeModal,
        }}
        header={
          <Heading headingProps={{ as: 'h3' }} colorVariant={HeadingColor.MAIN}>
            Email Program Code
          </Heading>
        }>
        <Formik
          initialValues={{ email: '' }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .required('Email is required')
              .email('Email is invalid'),
          })}
          onSubmit={this.doSendEmailCode}>
          {formikProps => (
            <form onSubmit={formikProps.handleSubmit}>
              <Input
                label="Email"
                classes={{ column: classes.mainStyles.emailProgramCodeInput }}
                inputProps={{
                  placeholder: 'Enter Email',
                  onChange: formikProps.handleChange,
                  onBlur: formikProps.handleBlur,
                  value: formikProps.values.email,
                  name: 'email',
                }}
                errorMessage={
                  (formikProps.touched.email &&
                    formikProps.errors.email) as string
                }
              />
              <Button
                colorVariant={ButtonColor.MAIN}
                buttonType={ButtonType.ROUND}
                buttonProps={{
                  size: 'medium',
                  disabled: !formikProps.isValid,
                  type: 'submit',
                  loading: formikProps.isSubmitting,
                }}>
                Send Program Code
              </Button>
            </form>
          )}
        </Formik>
      </Modal>
    );
  };

  render() {
    const {
      classes,
      program,
      onPlusIconClick,
      isActive,
      onDeleteProgram,
      isDeleting,
      onUpdateProgram,
      isUpdating,
      completionProgress = 0,
      readingLogProgress,
      userAccessProgram,
    } = this.props;
    const readingLog = get(program, 'attributes.reading_log') || 0;
    const readingLogObject =
      find(readingLogOptions, { value: readingLog }) || {};
    const readingLogValue = get(readingLogObject, 'text') || '';
    const programId = get(program, 'id');
    const accessProgram = get(userAccessProgram, `program[${programId}]`, {});
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
            name: idx(program, x => x.attributes.name),
            code: idx(program, x => x.attributes.code),
            type: idx(program, x => x.attributes.reading_log),
          }}
          onSubmit={values => {
            onUpdateProgram(program.id, {
              name: values.name,
              reading_log: readingLog,
            });
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required('Name is required'),
          })}>
          {formProps => {
            const { values, touched, errors } = formProps;
            return (
              <form
                className={cx(classes.mainStyles.formAccordion, {
                  [classes.mainStyles.isActiveAccordion]: isActive,
                })}
                onSubmit={formProps.handleSubmit}>
                <Accordion.Title
                  className={classes.mainStyles.accordionTitle}
                  index={0}
                  active={isActive}>
                  <div
                    className={cx(
                      classes.tableStyles.hoverPencilIcon,
                      classes.mainStyles.hoverIcon
                    )}>
                    <Icon name="eye" />
                  </div>
                  <Grid
                    className={classes.mainStyles.accordionGrid}
                    padded
                    verticalAlign="middle">
                    <Grid.Column
                      width={4}
                      onClick={() => this.gotoGroups(program.id)}>
                      <Heading
                        headingProps={{ as: 'h5' }}
                        type={HeadingType.BOLD_500}>
                        {program.attributes.name}
                      </Heading>
                    </Grid.Column>
                    <Grid.Column
                      width={1}
                      onClick={() => this.gotoGroups(program.id)}>
                      <Heading
                        headingProps={{ as: 'h5' }}
                        type={HeadingType.BOLD_500}>
                        {formatNumber(program.attributes.total_readers)}
                      </Heading>
                    </Grid.Column>
                    <Grid.Column
                      width={2}
                      onClick={() => this.gotoGroups(program.id)}>
                      <Heading
                        headingProps={{ as: 'h5' }}
                        type={HeadingType.BOLD_500}
                        colorVariant={HeadingColor.BLACK}>
                        {readingLogValue}
                      </Heading>
                    </Grid.Column>
                    <Grid.Column
                      width={6}
                      onClick={() => this.gotoGroups(program.id)}>
                      <Grid verticalAlign="middle">
                        {readingLog ? (
                          <Grid.Column width="16">
                            <ProgressDetail
                              readingLogProgress={readingLogProgress}
                            />
                          </Grid.Column>
                        ) : (
                          <ProgressPercentage
                            completionProgress={completionProgress}
                          />
                        )}
                      </Grid>
                    </Grid.Column>
                    <Grid.Column
                      width={3}
                      className={classes.mainStyles.accordionTitleLastColumn}>
                      {isActive && formProps.dirty && (
                        <Button
                          icon={<Icon name="save outline" />}
                          buttonType={ButtonType.ROUND}
                          colorVariant={ButtonColor.SUCCESS_FADE}
                          classes={{
                            button: classes.mainStyles.fontWeightNormal,
                          }}
                          buttonProps={{
                            size: 'tiny',
                            type: 'submit',
                            loading: isUpdating,
                          }}>
                          Save
                        </Button>
                      )}
                      {!isActive && (
                        <Icon
                          name="plus"
                          className={classes.mainStyles.plusIcon}
                          onClick={() => onPlusIconClick(program.id)}
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
                  <div className={classes.mainStyles.accordionContent}>
                    <div className={classes.mainStyles.leftPart}>
                      <div
                        className={cx(
                          classes.mainStyles.field,
                          classes.mainStyles.flex1
                        )}>
                        <Input
                          inputProps={{
                            placeholder: 'Type',
                            name: 'type',
                            value: readingLogObject.text,
                            disabled: true,
                          }}
                          label="Type"
                        />
                      </div>
                      <div
                        className={cx(
                          classes.mainStyles.field,
                          classes.mainStyles.flex1_5
                        )}>
                        <Input
                          inputProps={{
                            placeholder: 'Program Name',
                            name: 'name',
                            id: 'name',
                            value: values.name,
                            onChange: formProps.handleChange,
                            onBlur: formProps.handleBlur,
                            disabled: !accessProgram.write,
                          }}
                          label="Program Name"
                          errorMessage={touched.name && errors.name}
                          labelNote
                          labelNoteText="Your program name should be short and descriptive--like the library name or school mascot. It’s a good idea to create as few Reading Programs as possible and utilize multiple Reading Groups within each program."
                        />
                      </div>
                      <div
                        className={cx(
                          classes.mainStyles.programCode,
                          classes.mainStyles.field,
                          classes.mainStyles.flex1
                        )}>
                        <ProgramCode
                          copyable
                          label="Program Code"
                          code={values.code}
                          labelNote
                          labelNoteText="The reading program code is a unique five character code that your readers will enter to find your reading program when they sign up."
                        />
                      </div>
                    </div>
                    <div className={classes.mainStyles.rightPart}>
                      <div className={classes.mainStyles.field}>
                        <Button
                          buttonType={ButtonType.ROUND}
                          colorVariant={ButtonColor.SECONDARY}
                          icon={<EnvelopeSvg width={15} height={15} />}
                          classes={{
                            button: classes.mainStyles.rightPartButton,
                          }}
                          buttonProps={{
                            size: 'tiny',
                            type: 'button',
                            onClick: this.toggleEmailCodeModal,
                          }}>
                          Email Code
                        </Button>
                      </div>
                      {accessProgram.write && (
                        <div className={classes.mainStyles.field}>
                          <Button
                            buttonType={ButtonType.ROUND}
                            colorVariant={ButtonColor.SECONDARY}
                            icon={<EditorSvg width={15} height={15} />}
                            classes={{
                              button: classes.mainStyles.rightPartButton,
                            }}
                            buttonProps={{
                              size: 'tiny',
                              type: 'button',
                              onClick: () => {
                                this.props.history.push(
                                  urls.UPDATE_PROGRAM_ADVANCED({
                                    programId: program.id,
                                  })
                                );
                              },
                            }}>
                            Advanced Editor
                          </Button>
                        </div>
                      )}
                      <div className={classes.mainStyles.field}>
                        {readingLog === 2 && (
                          <Button
                            buttonType={ButtonType.ROUND}
                            colorVariant={ButtonColor.YELLOW}
                            icon={<MedalSvg width={15} height={15} />}
                            classes={{
                              button: classes.mainStyles.rightPartButton,
                            }}
                            buttonProps={{
                              size: 'tiny',
                              type: 'button',
                              onClick: () => {
                                this.props.history.push(
                                  urls.PROGRAMS_LEADERBOARD({
                                    programId: program.id,
                                  })
                                );
                              },
                            }}>
                            Leaderboard
                          </Button>
                        )}
                      </div>
                      {accessProgram.write && (
                        <div className={classes.mainStyles.field}>
                          <Button
                            icon={<Icon name="trash alternate outline" />}
                            buttonType={ButtonType.ROUND}
                            colorVariant={ButtonColor.DANGER_FADE}
                            classes={{
                              button: classes.mainStyles.rightPartButton,
                            }}
                            buttonProps={{
                              size: 'tiny',
                              type: 'button',
                              onClick: () => {
                                confirmModal.open({
                                  message:
                                    'This will delete your entire program. You will lose all associated Groups, Readers, along with their all data. Are you absolutely sure?',
                                  onOkClick: () => {
                                    onDeleteProgram(program.id);
                                  },
                                });
                              },
                              loading: isDeleting,
                            }}>
                            Delete Program
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Accordion.Content>
              </form>
            );
          }}
        </Formik>
        {this.renderEmailCodeModal()}
      </div>
    );
  }
}

export default themr<Props>('ProgramRow', { mainStyles: styles, tableStyles })(
  ProgramRow
);
