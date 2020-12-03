import * as React from 'react';
import Modal, { BaseModalProps } from 'src/components/Modal';
import { Grid } from 'semantic-ui-react';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import Heading, { HeadingType, HeadingColor } from 'src/components/Heading';
import Spinner from 'src/components/Spinner';
import Input from 'src/components/FormFields/Input';
import ParticipantsModal from 'src/components/Modal/ParticipantsModal';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import keys from 'lodash/keys';
import get from 'lodash/get';
import map from 'lodash/map';
import pick from 'lodash/pick';
import find from 'lodash/find';
import { IReaderItem } from 'src/store/types/common';
import ReactHtmlParser from 'react-html-parser';
import { IProgram } from 'src/store/types/organizer/program';
import Select from 'src/components/FormFields/Select';
import { template } from './template';

export type OutReachEmailModalProps = IComponentProps & {
  orgName: string;
  isLoading: boolean;
  onSave: Function;
  onSelectProgram: Function;
  allReaders: IReaderItem[];
  allPrograms: IProgram[];
  programs: IProgram[];
  programGroups: Record<string, any>;
};
export type OutReachEmailModalOutProps = BaseModalProps & {
  onCancel?: Function;
};
interface IOutReachEmailModalState {
  isOpenParticipantsModal: boolean;
  participants: any[];
  selectedGroup: any;
  selectedProgram: any;
}
class OutReachEmailModal extends React.Component<
  OutReachEmailModalProps & OutReachEmailModalOutProps,
  IOutReachEmailModalState
> {
  divRef = React.createRef<HTMLDivElement>();

  state = {
    isOpenParticipantsModal: false,
    participants: [],
    selectedGroup: null,
    selectedProgram: null,
  };

  /**
  /* We do need updateParticipants anymore 
  updateParticipants = () => {
    const { allReaders } = this.props;
    const { selectedGroup } = this.state;
    const participants = map(
      allReaders.filter((reader: any) =>
        selectedGroup ? reader.group.includes(selectedGroup) : true
      ),
      reader => ({
        ...pick(reader, ['email', 'user_id']),
      })
    );
    this.setState({ participants });
  } */

  componentDidMount() {
    const { programs } = this.props;

    const programOptions = programs.map((item: any) => ({
      value: item.id,
      text: item.attributes.name,
    }));
    const defaultProgram = get(programOptions[0], 'value', '');
    const participants = this.getParticipants(defaultProgram);

    this.setState({ participants });
  }

  componentWillReceiveProps(nextProps) {
    if (
      get(this.props, 'allReaders.length') === 0 &&
      get(nextProps, 'allReaders.length') > 0
    ) {
      const { selectedProgram, selectedGroup } = this.state;
      const participants = this.getParticipants(selectedProgram, selectedGroup);

      this.setState({ participants });
    }
  }

  /**
  /* We do need updateParticipants after change group anymore
  /*
  componentDidUpdate(_, prevState) {
    const { selectedGroup: prevSelectedGroup } = prevState;
    const { selectedGroup } = this.state;
    if (selectedGroup !== prevSelectedGroup) {
      this.updateParticipants();
    }
  }
  */

  onUpdateFormSubmit = (values: any) => {
    const toAddr = map(this.state.participants, user => user.email);
    const body = this.divRef.current.innerHTML;
    this.props.onSave({
      subject: values.subject,
      pCode: this.getProgramCode(values.program),
      body,
      to_addr: toAddr,
    });
  };

  setIsOpenParticipantsModal = (isOpenParticipantsModal: boolean) => {
    this.setState({ isOpenParticipantsModal });
  };

  getProgramCode = programId => {
    const { allPrograms } = this.props;
    const foundProgram = find(allPrograms, { id: programId }) || {};
    return get(foundProgram, 'attributes.code');
  };

  getParticipants = (selectedProgram, selectedGroup = null) => {
    const { allReaders } = this.props;
    let allParticipants = map(
      allReaders.filter((reader: any) => {
        return Object.values(reader.programs || []).includes(
          parseInt(selectedProgram, 10)
        );
      }),
      reader => ({
        ...pick(reader, ['email', 'user_id', 'programs', 'group']),
      })
    );

    if (selectedGroup !== null) {
      allParticipants = allParticipants.filter((reader: any) =>
        reader.group.includes(selectedGroup)
      );
    }

    return allParticipants;
  };

  render() {
    const {
      modelProps,
      classes,
      isLoading,
      onCancel,
      allReaders,
      orgName,
      allPrograms,
      programGroups,
    } = this.props;
    const { selectedGroup, selectedProgram } = this.state;
    const programOptions = allPrograms.map((item: any) => ({
      value: item.id,
      text: item.attributes.name,
    }));
    const defaultProgram = get(programOptions[0], 'value', '');
    if (defaultProgram !== '' && !programGroups[defaultProgram]) {
      this.props.onSelectProgram(defaultProgram);
    }
    const filterProgram =
      selectedProgram !== null ? selectedProgram : defaultProgram;
    let allParticipants = map(
      allReaders.filter((reader: any) => {
        return Object.values(reader.programs || []).includes(
          parseInt(filterProgram, 10)
        );
      }),
      reader => ({
        ...pick(reader, ['email', 'user_id', 'group']),
      })
    );

    if (selectedGroup !== null) {
      allParticipants = allParticipants.filter((reader: any) =>
        reader.group.includes(selectedGroup)
      );
    }

    const emailTemplate = template(
      orgName,
      this.getProgramCode(defaultProgram)
    );
    const initialValues = {
      subject: 'Reading Program News',
      body: emailTemplate,
      program: defaultProgram,
      group: null,
    };
    return (
      <div>
        <Modal modelProps={{ ...modelProps, closeIcon: true, size: 'large' }}>
          <div>
            <div className={classes.modalTop}>
              <div style={{ marginTop: 10 }}>
                <Heading
                  headingProps={{ as: 'h3' }}
                  type={HeadingType.BOLD_600}>
                  Email Users
                </Heading>
              </div>
            </div>
            <Grid>
              <Formik
                initialValues={{ ...initialValues }}
                enableReinitialize
                onSubmit={this.onUpdateFormSubmit}
                validationSchema={Yup.object().shape({
                  body: Yup.string().required('Body is Required'),
                  subject: Yup.string().required('Subject is Required'),
                })}>
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  setFieldValue,
                }) => {
                  const currentProgramGroups =
                    values.program && values.program.length > 0
                      ? get(programGroups, `${values.program}.data`, [])
                      : [];
                  const programGroupOptions = currentProgramGroups.map(
                    (item: any) => ({
                      value: item.id,
                      text: item.attributes.name,
                    })
                  );
                  return (
                    <Form className={classes.form}>
                      <Grid columns={2}>
                        {/* <Label classes={{ labelStyle: classes.label }}>Program</Label> */}
                        <Grid.Column>
                          <Select
                            selectProps={{
                              options: programOptions,
                              value: values.program,
                              name: 'program',
                              onChange: (_, data) => {
                                if (data.value !== values.program) {
                                  setFieldValue('group', null);
                                  if (
                                    data.value &&
                                    // @ts-ignore
                                    !programGroups[data.value]
                                  ) {
                                    this.props.onSelectProgram(data.value);
                                  }
                                }
                                const participants = this.getParticipants(
                                  data.value
                                );
                                this.setState(
                                  {
                                    selectedProgram: data.value,
                                    selectedGroup: null,
                                    participants,
                                  },
                                  () => {
                                    setFieldValue('program', data.value);
                                    setFieldValue(
                                      'body',
                                      template(
                                        orgName,
                                        this.getProgramCode(data.value)
                                      )
                                    );
                                  }
                                );
                              },
                              placeholder: 'Select Program',
                            }}
                            label="Select Program"
                          />
                        </Grid.Column>
                        <Grid.Column>
                          <Select
                            selectProps={{
                              options: programGroupOptions,
                              value: values.group,
                              name: 'group',
                              onChange: (_, data) => {
                                const participants = this.getParticipants(
                                  selectedProgram,
                                  data.value
                                );
                                this.setState(
                                  { selectedGroup: data.value, participants },
                                  () => {
                                    setFieldValue('group', data.value);
                                  }
                                );
                              },
                              placeholder: 'Select Group',
                            }}
                            label="Select Group"
                          />
                        </Grid.Column>
                      </Grid>
                      <Grid>
                        <Input
                          inputProps={{
                            placeholder: 'Subject Address',
                            type: 'subject',
                            onChange: handleChange,
                            onBlur: handleBlur,
                            value: values.subject,
                            name: 'subject',
                          }}
                          label="Subject"
                          errorMessage={
                            get(touched, 'subject') && get(errors, 'subject')
                          }
                        />
                      </Grid>
                      <Grid>
                        <div
                          className={classes.editor}
                          contentEditable
                          ref={this.divRef}
                          suppressContentEditableWarning>
                          {ReactHtmlParser(values.body)}
                        </div>
                        {/* <TextArea
                          textAreaProps={{
                            placeholder: 'Please enter your message',
                            type: 'body',
                            onChange: handleChange,
                            onBlur: handleBlur,
                            value: values.body,
                            name: 'body',
                            className: classes.editor,
                            rows: 15,
                          }}
                          label="Message"
                          errorMessage={
                            get(touched, 'body') && get(errors, 'body')
                          }
                        /> */}
                      </Grid>
                      <Grid>
                        <Grid.Row textAlign="center" verticalAlign="middle">
                          <div className={classes.linkParticipants}>
                            Send this message to all participants (recommended)
                          </div>
                          <div className={classes.changeBtn}>
                            <Button
                              colorVariant={ButtonColor.PRIMARY_COLOR}
                              buttonType={ButtonType.ROUND}
                              buttonProps={{
                                onClick: () =>
                                  this.setIsOpenParticipantsModal(true),
                                type: 'button',
                              }}>
                              <Heading
                                headingProps={{ as: 'h5' }}
                                colorVariant={HeadingColor.WHITE}
                                type={HeadingType.BOLD_600}>
                                CHANGE
                              </Heading>
                            </Button>
                          </div>
                          <div className={classes.bottomButtons}>
                            <Button
                              colorVariant={ButtonColor.GRAY}
                              buttonType={ButtonType.ROUND}
                              buttonProps={{
                                type: 'button',
                                onClick: () => onCancel(),
                              }}>
                              Cancel
                            </Button>
                            <Button
                              colorVariant={ButtonColor.PRIMARY}
                              buttonType={ButtonType.ROUND}
                              buttonProps={{
                                loading: isLoading,
                                disabled: keys(errors).length !== 0,
                                type: 'submit',
                              }}>
                              Send email
                            </Button>
                          </div>
                        </Grid.Row>
                      </Grid>
                    </Form>
                  );
                }}
              </Formik>
            </Grid>
          </div>
          {isLoading && (
            <div className={classes.loadingContainer}>
              <Spinner />
            </div>
          )}
        </Modal>
        <ParticipantsModal
          modelProps={{
            open: this.state.isOpenParticipantsModal,
            size: 'small',
            onClose: () => this.setIsOpenParticipantsModal(false),
          }}
          participants={this.state.participants}
          allParticipants={allParticipants}
          onCancel={() => this.setIsOpenParticipantsModal(false)}
          onSelected={participants => this.setState({ participants })}
        />
      </div>
    );
  }
}
export default OutReachEmailModal;
