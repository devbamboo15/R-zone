import * as React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import cx from 'classnames';
import set from 'lodash/set';
import clone from 'lodash/clone';
import Title from 'src/components/Title';
import Modal from 'src/components/Modal';
import Input from 'src/components/FormFields/Input';
import GroupsSvg from 'src/assets/icons/groups.svg';
import { Grid, Icon } from 'semantic-ui-react';
import Button, { ButtonType, ButtonColor } from 'src/components/Button';
import Checkbox from 'src/components/FormFields/Checkbox';
import Select from 'src/components/FormFields/Select';
import idx from 'idx';
import { formatNumber } from 'src/helpers/number';
import urls from 'src/helpers/urls';
import { IProgram } from 'src/store/types/organizer/program';
import { IOrganizerGroup } from 'src/store/types/common';
import get from 'lodash/get';
import { confirmModal } from 'src/components/Modal/ConfirmationModal';
import Heading, { HeadingType, HeadingColor } from 'src/components/Heading';
import HelperIcon from 'src/components/Helper/Icon';
import ProgramCode, { Size } from 'src/components/ProgramCode';
import { ISignUpQuestion } from 'src/store/types/organizer/questions';
import deepEqual from 'deep-equal';
import Loading from 'src/screens/Setup/components/Loading';
import AdvanceProgramCreatorRow from './Row';

interface IParams {
  programId: string;
}
interface IMatch {
  params: IParams;
}
export type Props = IScreenProps & {
  saveProgram: any;
  updateProgram: any;
  cloneProgram: any;
  programCreationInProgress: boolean;
  programEditionInProgress: boolean;
  programCreationSuccess: boolean;
  currentProgram?: IProgram;
  programGroup?: IOrganizerGroup[];
  programGroupLoading: boolean;
  match?: IMatch;
  programCode: string;
  programCodeLoading: boolean;
  cloneProgramLoading: boolean;
  getNewProgramCode: Function;
  signupQuestions: ISignUpQuestion[];
  userAccessProgram: any;
};

class AdvancedProgramCreator extends React.Component<Props> {
  formRef: any = React.createRef();

  state = {
    isClosing: false,
    touchedAll: false,
    checkedAll: false,
  };

  componentDidUpdate(prevProps: Props) {
    const { programCreationSuccess, history, cloneProgramLoading } = this.props;
    if (
      (programCreationSuccess &&
        prevProps.programCreationSuccess !== programCreationSuccess) ||
      (!cloneProgramLoading &&
        prevProps.cloneProgramLoading !== cloneProgramLoading)
    ) {
      history.push(urls.PROGRAMS());
      this.props.getNewProgramCode();
    }
  }

  addNewRow = formProps => {
    const totalRows = idx(formProps, x => x.values.rows.length);
    formProps.setFieldValue(`rows[${totalRows}]`, {
      selected: false,
      attributes: {
        name: '',
      },
      goal: {
        attributes: {
          metric_id: '',
          value: formProps.values.readingLog ? 0 : '',
          interval_id: formProps.values.readingLog ? null : '',
          start_date: null,
          end_date: null,
        },
      },
    });
  };

  onSelectAllChange = (checked, formProps) => {
    const { rows } = formProps.values;
    let newRows = clone(rows);
    if (checked) {
      // select all rows
      newRows = newRows.map(row => {
        row.selected = true;
        return row;
      });
    } else {
      // unselect all rows
      newRows = newRows.map(row => {
        row.selected = false;
        return row;
      });
    }
    formProps.setFieldValue(`selectRow`, {});
    formProps.setFieldValue(`rows`, newRows);
  };

  isAnyRowSelected = rows => {
    return rows.some(row => row.selected);
  };

  onHeaderRowUpdate = (formProps, key, val) => {
    formProps.setFieldValue(`selectRow.${key}`, val);
    formProps.setFieldTouched(`selectRow.${key}`);
    const { rows } = formProps.values;
    let newRows = clone(rows);

    newRows = newRows.map(row => {
      if (row.selected) {
        row = set(row, key, val);
        return row;
      }
      return row;
    });

    formProps.setFieldValue('rows', newRows);
  };

  getRowsValidation = isReadingLog => {
    if (isReadingLog) {
      return Yup.array().of(
        Yup.object().shape({
          attributes: Yup.object().shape({
            name: Yup.string().required('Name is required!'),
          }),
          goal: Yup.object().shape({
            attributes: Yup.object().shape({
              metric_id: Yup.string().required('Metric is required!'),
              start_date: Yup.mixed().required('Start Date is required!'),
              end_date: Yup.mixed().required('End Date is required!'),
            }),
          }),
        })
      );
    }
    return Yup.array().of(
      Yup.object().shape({
        attributes: Yup.object().shape({
          name: Yup.string().required('Name is required!'),
        }),
        goal: Yup.object().shape({
          attributes: Yup.object().shape({
            metric_id: Yup.string().required('Metric is required!'),
            value: Yup.number()
              .typeError('It should be number!')
              .min(1, 'Enter more than 0!')
              .required('Value is required!'),
            interval_id: Yup.string()
              .typeError('Interval is required!')
              .required('Interval is required!'),
            start_date: Yup.mixed().required('Start Date is required!'),
            end_date: Yup.mixed().required('End Date is required!'),
          }),
        }),
      })
    );
  };

  handleCloneProgram = () => {
    const { currentProgram, match, cloneProgram } = this.props;
    confirmModal.open({
      message: `Do you want to clone program ${currentProgram.attributes.name}`,
      onOkClick: () => {
        const programId = get(match, 'params.programId');
        cloneProgram(programId);
      },
    });
  };

  renderBody = formProps => {
    const {
      classes,
      signupQuestions,
      userAccessProgram,
      programGroupLoading,
    } = this.props;
    const { touchedAll, checkedAll } = this.state;
    const { rows, readingLog, selectRow } = formProps.values;
    const { touched, errors } = formProps;
    const isAnyRowSelected = this.isAnyRowSelected(rows);
    const { programId } = this.props.match.params;
    return (
      <div className={classes.body}>
        <Grid padded>
          <Grid.Row
            className={cx(classes.tableHeader, classes.checkboxSelectAll)}>
            <Grid.Column width={1} className={classes.checkboxWrapper}>
              <Checkbox
                checkboxProps={{
                  checked: checkedAll,
                  onChange: (_, { checked }) => {
                    this.onSelectAllChange(checked, formProps);
                    this.setState({
                      checkedAll: checked,
                    });
                  },
                }}
              />
              <Heading
                headingProps={{
                  as: 'h5',
                  textAlign: 'center',
                  className: 'selectAllHeading',
                  onClick: () => {
                    this.onSelectAllChange(true, formProps);
                    this.setState({
                      checkedAll: true,
                    });
                  },
                }}
                colorVariant={HeadingColor.SECONDARY}
                type={HeadingType.NORMAL}>
                Select All
              </Heading>
            </Grid.Column>
            <Grid.Column width={2} className={classes.headerTittle}>
              <HelperIcon />
              Group Name
            </Grid.Column>
            <Grid.Column width={2} className={classes.headerTittle}>
              <HelperIcon />
              Goal Metric
            </Grid.Column>
            {!readingLog && (
              <Grid.Column width={1} className={classes.headerTittle}>
                <HelperIcon />
                Goal Value
              </Grid.Column>
            )}
            {!readingLog && (
              <Grid.Column width={2} className={classes.headerTittle}>
                <HelperIcon />
                Goal Frequency
              </Grid.Column>
            )}
            <Grid.Column width={2} className={classes.headerTittle}>
              <HelperIcon />
              Start Date
            </Grid.Column>
            <Grid.Column width={2} className={classes.headerTittle}>
              <HelperIcon />
              End Date
            </Grid.Column>
            <Grid.Column width={2} className={classes.headerTittle}>
              Book Bank
            </Grid.Column>
            <Grid.Column width={2} className={classes.headerTittle}>
              Questions
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {programGroupLoading ? (
          <div>
            <Loading />
          </div>
        ) : (
          <div className={classes.groupRows}>
            <Grid padded style={{ paddingBottom: '250px' }}>
              {isAnyRowSelected && (
                <AdvanceProgramCreatorRow
                  questionList={signupQuestions}
                  isHeaderRow
                  isReadingLog={readingLog}
                  userAccessProgram={userAccessProgram}
                  programId={programId}
                  updateData={(key, val) => {
                    this.onHeaderRowUpdate(formProps, key, val);
                  }}
                  data={selectRow || {}}
                />
              )}
              {rows.map((row, index) => {
                return (
                  <AdvanceProgramCreatorRow
                    isReadingLog={readingLog}
                    key={index}
                    updateData={(key, val) => {
                      let newRows = clone(rows);
                      newRows = set(newRows, `${index}.${key}`, val);
                      formProps.setFieldValue('rows', newRows);
                      formProps.setFieldTouched(`rows.${index}.${key}`);
                    }}
                    userAccessProgram={userAccessProgram}
                    programId={programId}
                    questionList={signupQuestions}
                    data={row}
                    errors={idx(errors, x => x.rows[index])}
                    touched={idx(touched, x => x.rows[index])}
                    touchedAll={touchedAll}
                  />
                );
              })}
            </Grid>
          </div>
        )}
      </div>
    );
  };

  renderForm = formProps => {
    const {
      classes,
      programCreationInProgress,
      history,
      programEditionInProgress,
      cloneProgramLoading,
      currentProgram,
    } = this.props;
    const { touchedAll } = this.state;
    const { touched = {}, errors = {}, values = {} } = formProps;
    return (
      <form
        className={classes.modalFormContent}
        onSubmit={formProps.handleSubmit}>
        {/* Header */}
        <div className={classes.header}>
          <Title icon={<GroupsSvg height={30} />}>
            Advanced Program Creator
          </Title>
          <Grid>
            <Grid.Row verticalAlign="bottom">
              <Grid.Column width={3}>
                <Input
                  label="Program Name"
                  inputProps={{
                    placeholder: 'Program Name',
                    onChange: (_, { value }) => {
                      formProps.setFieldValue('name', value);
                      formProps.setFieldTouched('name');
                    },
                    value: formProps.values.name,
                  }}
                  highlight
                  errorMessageOverlap
                  errorMessage={
                    ((touched.name || touchedAll) && errors.name) ||
                    (touchedAll &&
                      values.name === '' &&
                      !touched.name &&
                      'Program Name is required')
                  }
                />
              </Grid.Column>
              <Grid.Column width={3}>
                <Select
                  label="Type"
                  selectProps={{
                    placeholder: 'Select Type',
                    options: [
                      {
                        value: 0,
                        text: 'Goal Based',
                      },
                      {
                        value: 1,
                        text: 'Reading Log',
                      },
                    ],
                    onChange: (_, { value }) => {
                      formProps.setFieldValue('readingLog', value);
                      formProps.setFieldTouched('readingLog');
                    },
                    value: formProps.values.readingLog,
                  }}
                  highlight
                  errorMessageOverlap
                  errorMessage={
                    ((touched.readingLog || touchedAll) && errors.readingLog) ||
                    (touchedAll &&
                      values.readingLog === '' &&
                      !touched.readingLog &&
                      'Type is required')
                  }
                />
              </Grid.Column>
              <Grid.Column width={3}>
                <ProgramCode
                  size={Size.SMALL}
                  label="Program Code"
                  code={formProps.values.code}
                />
              </Grid.Column>
              <Grid.Column width={3}>
                {/* <div className={classes.videoTutorialText}>
                  <Icon name="video camera" />
                  View Video Tutorial
                </div> */}
              </Grid.Column>
              {currentProgram && currentProgram.attributes && (
                <Grid.Column width={4} textAlign="right">
                  <Button
                    buttonProps={{
                      type: 'button',
                      onClick: this.handleCloneProgram,
                      loading: cloneProgramLoading,
                    }}
                    buttonType={ButtonType.ROUND_OUTLINED}
                    colorVariant={ButtonColor.SECONDARY}>
                    Clone this program
                  </Button>
                </Grid.Column>
              )}
            </Grid.Row>
          </Grid>
        </div>
        {/* Body */}
        {this.renderBody(formProps)}
        {/* Footer */}
        <div className={classes.footer}>
          <Grid verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={7} className={classes.groupInfo}>
                <Button
                  icon={<Icon name="add circle" />}
                  buttonType={ButtonType.ROUND}
                  colorVariant={ButtonColor.PRIMARY}
                  buttonProps={{
                    onClick: () => {
                      this.addNewRow(formProps);
                    },
                    type: 'button',
                  }}>
                  Add Group
                </Button>
                <div className={classes.totalGroups}>
                  <div
                    className={classes.totalGroupsLabel}
                    style={{ marginRight: '0.5rem' }}>
                    Total Groups:{' '}
                  </div>
                  <div className={classes.totalGroupsNumber}>
                    {formatNumber(formProps.values.rows.length)}
                  </div>
                </div>
              </Grid.Column>
              <Grid.Column width={5} />
              <Grid.Column width={4} className={classes.actionButtons}>
                <Button
                  icon={<Icon name="ban" />}
                  buttonType={ButtonType.ROUND}
                  colorVariant={ButtonColor.DANGER}
                  buttonProps={{
                    type: 'button',
                    onClick: () => {
                      history.goBack();
                    },
                  }}>
                  Cancel
                </Button>
                <Button
                  icon={<Icon name="save outline" />}
                  buttonType={ButtonType.ROUND}
                  colorVariant={ButtonColor.PRIMARY}
                  buttonProps={{
                    type: 'submit',
                    onClick: () => {
                      this.setState({
                        touchedAll: true,
                      });
                    },
                    loading:
                      programCreationInProgress || programEditionInProgress,
                  }}>
                  Save
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </form>
    );
  };

  checkClosing = () => {
    const { history } = this.props;
    const { isClosing } = this.state;
    if (isClosing) {
      history.goBack();
    }
  };

  handleSubmit = (formPropsValue): void => {
    const { currentProgram, saveProgram, match } = this.props;
    const programId = get(match, 'params.programId');
    const oldReadingLog = get(currentProgram, 'attributes.reading_log');
    const currentReadingLog = get(formPropsValue, 'readingLog');
    if (oldReadingLog !== currentReadingLog && programId) {
      confirmModal.open({
        message:
          'All entries made against that Group will be erased. Are you sure?',
        onOkClick: () => {
          saveProgram(formPropsValue, currentProgram.id, this.checkClosing);
        },
      });
    } else {
      saveProgram(formPropsValue, currentProgram.id, this.checkClosing);
    }
  };

  render() {
    const {
      classes,
      history,
      currentProgram,
      programGroup,
      match,
      programCode,
    } = this.props;
    const programId = get(match, 'params.programId');
    const initialValues: any = {
      name:
        currentProgram && currentProgram.attributes && programId
          ? currentProgram.attributes.name
          : '',
      code:
        currentProgram && currentProgram.attributes && programId
          ? currentProgram.attributes.code
          : programCode,
      readingLog:
        currentProgram && currentProgram.attributes && programId
          ? currentProgram.attributes.reading_log
          : '',
      rows:
        programGroup && programGroup.length > 0 && programId
          ? programGroup
          : [
              {
                selected: false,
                attributes: {
                  name: '',
                },
                goal: {
                  attributes: {
                    metric_id: '',
                    value: 0,
                    interval_id: null,
                    start_date: null,
                    end_date: null,
                  },
                },
                books: [],
              },
            ],
      selectRow: {},
    };
    const compareInstance = JSON.parse(JSON.stringify(initialValues));

    return (
      <Modal
        modelProps={{
          open: true,
          closeOnDimmerClick: false,
          size: 'fullscreen',
          closeIcon: true,
          onClose: () => {
            const currentValues = get(this.formRef, 'current.state.values', {});
            if (deepEqual(compareInstance, currentValues)) {
              history.goBack();
              return;
            }

            confirmModal.open({
              okButtonText: 'Save',
              cancelButtonText: 'Discard',
              message:
                'You have unsaved changes in this program. Would you like to save your changes before leaving?',
              onOkClick: () => {
                this.setState(
                  {
                    touchedAll: true,
                    isClosing: true,
                  },
                  () => {
                    this.formRef.current.submitForm();
                  }
                );
              },
              onCancelClick: () => {
                history.goBack();
              },
            });
          },
          className: classes.modal,
        }}
        contentProps={{ className: classes.modalContent }}>
        <Formik
          ref={this.formRef}
          initialValues={initialValues}
          onSubmit={this.handleSubmit}
          enableReinitialize={!!programId}
          validationSchema={Yup.object().shape({
            name: Yup.string().required('Program name is required!'),
            readingLog: Yup.number().required('Type is required!'),
            rows: Yup.mixed().when('readingLog', readingLog => {
              return readingLog === 1
                ? this.getRowsValidation(true)
                : this.getRowsValidation(false);
            }),
          })}
          render={this.renderForm}
        />
      </Modal>
    );
  }
}

export default AdvancedProgramCreator;
