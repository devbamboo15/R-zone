import * as React from 'react';
import * as moment from 'moment';
import cx from 'classnames';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import Select from 'src/components/FormFields/Select';
import AddReaderNoteModal from 'src/components/Modal/AddReaderNoteModal';
import ReaderNoteSvg from 'assets/icons/reader_note.svg';
import Heading, { HeadingType } from 'src/components/Heading';
import Input from 'src/components/FormFields/Input';
import { List, Grid, InputOnChangeData, Icon } from 'semantic-ui-react';
import idx from 'idx';
import capitalize from 'lodash/capitalize';
import get from 'lodash/get';
import last from 'lodash/last';
import map from 'lodash/map';
import first from 'lodash/first';
import find from 'lodash/find';
import { FieldArray, getIn } from 'formik';
import { IReaderItem, IUserData, INoteData } from 'src/store/types/common';
import { IProgram } from 'src/store/types/organizer/program';
import { UserRole } from 'src/store/types/organizer/reader';
import SingleDatePicker from 'src/components/SingleDatePicker';
import { isInternalEmail } from 'src/helpers/email';
// import { isInternalEmail } from 'src/helpers/email';

export type UpdateReaderFormProps = IComponentProps & {
  programGroups: any;
  userAccessProgram: any;
  role: string;
};
export interface UpdateReaderFormOutProps {
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) => void;
  handleBlur: (
    event: React.ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) => void;
  values: any;
  errors?: any;
  touched?: any;
  programs?: IProgram[];
  setFieldValue?: Function;
  reader: IReaderItem;
  readerData: IUserData;
  notes: INoteData[];
  onListReadersRefresh: Function;
  existingProgramGroup?: any[];
  isWriteAble?: boolean;
}
export interface UpdateReaderFormState {
  isOpenAddReaderNoteModal: boolean;
}
class UpdateReaderForm extends React.PureComponent<
  UpdateReaderFormProps & UpdateReaderFormOutProps,
  UpdateReaderFormState
> {
  constructor(props) {
    super(props);
    this.state = {
      isOpenAddReaderNoteModal: false,
    };
  }

  toggleAddReaderNoteModal = () => {
    this.setState(state => ({
      isOpenAddReaderNoteModal: !state.isOpenAddReaderNoteModal,
    }));
  };

  getGroupsOptionByProgramId = (
    programId: string | number,
    selectedGroups?: any
  ) => {
    const { programGroups } = this.props;
    const groups =
      idx(programGroups, x => x[programId].data || []).filter(
        g => (selectedGroups || []).indexOf(g.id) < 0
      ) || [];
    return map(groups, (iGroup: any) => ({
      text: iGroup.attributes.name,
      value: Number(iGroup.id),
    }));
  };

  getOptionText = (options, value) => {
    return (find(options, { value }) || {}).text || '';
  };

  private renderChildProgramGroup = (arrayHelpers: any) => {
    const { form } = arrayHelpers;
    const { programs, isWriteAble, classes } = this.props;
    const programsOption = map(programs, (item: any) => ({
      value: Number(item.id),
      text: item.attributes.name,
    }));

    return (
      <div>
        {get(form.values, 'childProgramGroup', []).map(
          (child: any, rootIndex: any) => {
            return (
              <Grid key={rootIndex}>
                <Grid.Row>
                  <Grid columns={4}>
                    <Grid.Column width={2}>
                      <Button
                        colorVariant={ButtonColor.MAIN}
                        buttonType={ButtonType.ROUND}
                        btnClass={classes.minusButton}
                        buttonProps={{
                          type: 'button',
                          onClick: () => arrayHelpers.remove(rootIndex),
                        }}>
                        -
                      </Button>
                    </Grid.Column>
                    {/* <Grid.Column width={4}> */}
                    {/*  <Input */}
                    {/*    inputProps={{ */}
                    {/*      disabled: !isWriteAble, */}
                    {/*      placeholder: 'Email', */}
                    {/*      onChange: (_, { value }) => { */}
                    {/*        const data = { */}
                    {/*          ...child, */}
                    {/*          email: value, */}
                    {/*        }; */}
                    {/*        arrayHelpers.replace(rootIndex, data); */}
                    {/*      }, */}
                    {/*      onBlur: () => {}, */}
                    {/*      value: get(child, 'email', ''), */}
                    {/*      name: 'email', */}
                    {/*    }} */}
                    {/*    label="Email" */}
                    {/*    errorMessage={getIn( */}
                    {/*      form.errors, */}
                    {/*      `childProgramGroup.${rootIndex}.email` */}
                    {/*    )} */}
                    {/*  /> */}
                    {/* </Grid.Column> */}
                    <Grid.Column width={6}>
                      <Input
                        inputProps={{
                          disabled: !isWriteAble,
                          placeholder: 'First Name',
                          onChange: (_, { value }) => {
                            const data = {
                              ...child,
                              first_name: value,
                            };
                            arrayHelpers.replace(rootIndex, data);
                          },
                          onBlur: () => {},
                          value: get(child, 'first_name', ''),
                          name: 'first_name',
                        }}
                        label="First Name"
                        errorMessage={getIn(
                          form.errors,
                          `childProgramGroup.${rootIndex}.first_name`
                        )}
                      />
                    </Grid.Column>
                    <Grid.Column width={6}>
                      <Input
                        inputProps={{
                          disabled: !isWriteAble,
                          placeholder: 'Last Name',
                          onChange: (_, { value }) => {
                            const data = {
                              ...child,
                              last_name: value,
                            };
                            arrayHelpers.replace(rootIndex, data);
                          },
                          onBlur: () => {},
                          value: get(child, 'last_name', ''),
                          name: 'last_name',
                        }}
                        label="Last Name"
                        errorMessage={getIn(
                          form.errors,
                          `childProgramGroup.${rootIndex}.last_name`
                        )}
                      />
                    </Grid.Column>
                  </Grid>
                </Grid.Row>
                <Grid.Row>
                  <div className={this.props.classes.programGroupDataField}>
                    {get(child, 'programGroupData', []).map(
                      (item: any, index: any) => {
                        return (
                          <Grid columns={3} key={index}>
                            <Grid.Column width={5}>
                              <Select
                                label="Program"
                                selectProps={{
                                  placeholder: 'Program',
                                  value: item.program,
                                  options: programsOption,
                                  onChange: (_, e) => {
                                    const value = {
                                      program: e.value,
                                      group: '',
                                      groupsOption: this.getGroupsOptionByProgramId(
                                        e.value as string | number
                                      ),
                                    };
                                    const { programGroupData } = child;
                                    programGroupData.splice(index, 1, value);

                                    arrayHelpers.replace(rootIndex, {
                                      ...child,
                                      programGroupData,
                                    });
                                  },
                                }}
                              />
                            </Grid.Column>
                            <Grid.Column width={5}>
                              <Select
                                label="Group"
                                selectProps={{
                                  placeholder: 'Group',
                                  value: item.group,
                                  options: item.groupsOption,
                                  onChange: (_, e) => {
                                    const value = {
                                      ...item,
                                      group: e.value,
                                    };
                                    const { programGroupData } = child;
                                    programGroupData.splice(index, 1, value);

                                    arrayHelpers.replace(rootIndex, {
                                      ...child,
                                      programGroupData,
                                    });
                                  },
                                }}
                              />
                            </Grid.Column>
                            <Grid.Column width={2}>
                              <Button
                                colorVariant={ButtonColor.MAIN}
                                buttonType={ButtonType.ROUND}
                                btnClass={classes.minusButton}
                                buttonProps={{
                                  type: 'button',
                                  onClick: () => {
                                    const { programGroupData } = child;
                                    programGroupData.splice(index, 1);

                                    arrayHelpers.replace(rootIndex, {
                                      ...child,
                                      programGroupData,
                                    });
                                  },
                                }}>
                                -
                              </Button>
                            </Grid.Column>
                          </Grid>
                        );
                      }
                    )}
                    {typeof getIn(
                      form.errors,
                      `childProgramGroup.${rootIndex}.programGroupData`
                    ) === 'string' ? (
                      <Grid>
                        <div className={this.props.classes.errorMessage}>
                          {getIn(
                            form.errors,
                            `childProgramGroup.${rootIndex}.programGroupData`
                          )}
                        </div>
                      </Grid>
                    ) : null}
                    {isWriteAble && (
                      <Grid>
                        <Button
                          colorVariant={ButtonColor.MAIN}
                          buttonType={ButtonType.ROUND}
                          buttonProps={{
                            type: 'button',
                            onClick: () => {
                              // init default value
                              const programId = first(programsOption).value;
                              const groupsOption = this.getGroupsOptionByProgramId(
                                programId as string | number
                              );
                              const groupId = first(groupsOption).value;
                              const value = {
                                program: programId,
                                group: groupId,
                                groupsOption,
                              };
                              const data = {
                                ...child,
                                programGroupData: [
                                  ...child.programGroupData,
                                  value,
                                ],
                              };
                              arrayHelpers.replace(rootIndex, data);
                            },
                          }}>
                          + Add Program or Group
                        </Button>
                      </Grid>
                    )}
                  </div>
                </Grid.Row>
              </Grid>
            );
          }
        )}
        {typeof get(form, 'errors.childProgramGroup') === 'string' ? (
          <Grid>
            <div className={this.props.classes.errorMessage}>
              {get(form, 'errors.childProgramGroup')}
            </div>
          </Grid>
        ) : null}
        <Grid className={this.props.classes.addChildButtonContainer}>
          <Button
            colorVariant={ButtonColor.MAIN}
            buttonType={ButtonType.ROUND}
            buttonProps={{
              type: 'button',
              onClick: () => {
                // init default value
                const programId = first(programsOption).value;
                const groupsOption = this.getGroupsOptionByProgramId(
                  programId as string | number
                );
                const groupId = first(groupsOption).value;
                const value = {
                  first_name: '',
                  last_name: '',
                  programGroupData: [
                    {
                      program: programId,
                      group: groupId,
                      groupsOption,
                    },
                  ],
                };
                arrayHelpers.push(value);
              },
            }}>
            + Add Child
          </Button>
        </Grid>
      </div>
    );
  };

  hadAllGroupSelected = (program, allGroups) => {
    let hadAll = true;
    // eslint-disable-next-line array-callback-return
    get(program, 'relationships.groups.data', []).map(g => {
      if (allGroups.indexOf(parseInt(g.id, 10)) < 0) {
        hadAll = false;
      }
    });
    return hadAll;
  };

  private renderProgramGroup = (arrayHelpers: any) => {
    const { form } = arrayHelpers;
    const { programs, isWriteAble, existingProgramGroup, classes } = this.props;
    // let selectedProgramsGroups = get(form.values, 'programGroup', []);
    // selectedProgramsGroups = selectedProgramsGroups.filter(
    //   item => item.groupsOption.length > 0
    // );
    const selectedProgramsGroups = get(form.values, 'programGroup', []);
    const selectedProgramsGroupsLength = selectedProgramsGroups.length;
    const lastProgramId = (last(selectedProgramsGroups) || {}).program || '';
    const selectedGroups = selectedProgramsGroups
      .filter(pg => pg.group)
      .map(pg => pg.group);
    const remainPrograms = programs.filter(
      p =>
        !this.hadAllGroupSelected(p, selectedGroups) ||
        (lastProgramId && p.id === lastProgramId.toString())
    );
    const allProgramsOption = map(programs, (item: any) => {
      return {
        value: Number(item.id),
        text: item.attributes.name,
      };
    });
    const programsOption = map(remainPrograms, (item: any) => {
      return {
        value: Number(item.id),
        text: item.attributes.name,
      };
    });

    return (
      <div>
        {selectedProgramsGroups.map((item: any, index: any) => {
          return (
            <Grid columns={3} key={index}>
              <Grid.Column width={4}>
                {get(existingProgramGroup, `[${index}].program`) ===
                  item.program || index < selectedProgramsGroupsLength - 1 ? (
                  <div>
                    <label className={classes.label}>Program</label>
                    <p>{this.getOptionText(allProgramsOption, item.program)}</p>
                  </div>
                ) : (
                  <Select
                    label="Program"
                    selectProps={{
                      placeholder: 'Program',
                      value: item.program,
                      options: programsOption,
                      onChange: (_, e) => {
                        const value = {
                          program: e.value,
                          group: '',
                          groupsOption: this.getGroupsOptionByProgramId(
                            e.value as string | number,
                            selectedGroups
                          ),
                        };
                        arrayHelpers.replace(index, value);
                      },
                    }}
                  />
                )}
              </Grid.Column>
              <Grid.Column width={4}>
                {get(existingProgramGroup, `[${index}].group`) === item.group ||
                index < selectedProgramsGroupsLength - 1 ? (
                  <div>
                    <label className={classes.label}>Group</label>
                    <p>{this.getOptionText(item.groupsOption, item.group)}</p>
                  </div>
                ) : (
                  <Select
                    label="Group"
                    selectProps={{
                      placeholder: 'Group',
                      value: item.group,
                      options: item.groupsOption,
                      onChange: (_, e) => {
                        const value = {
                          ...item,
                          group: e.value,
                        };
                        arrayHelpers.replace(index, value);
                      },
                    }}
                  />
                )}
              </Grid.Column>
              {isWriteAble && (
                <Grid.Column
                  width={3}
                  verticalAlign="bottom"
                  className={classes.removeProgramGroupBtn}>
                  <Button
                    colorVariant={ButtonColor.MAIN}
                    buttonType={ButtonType.ROUND}
                    icon={<Icon name="trash alternate outline" />}
                    buttonProps={{
                      type: 'button',
                      onClick: () => arrayHelpers.remove(index),
                    }}
                  />
                </Grid.Column>
              )}
            </Grid>
          );
        })}
        {typeof get(form, 'errors.programGroup') === 'string' ? (
          <Grid>
            <div className={classes.errorMessage}>
              {get(form, 'errors.programGroup')}
            </div>
          </Grid>
        ) : null}
        {isWriteAble && (
          <Grid>
            <Button
              colorVariant={ButtonColor.MAIN}
              buttonType={ButtonType.ROUND}
              buttonProps={{
                type: 'button',
                onClick: () => {
                  // init default value
                  // const programId = first(programsOption).value;
                  // const groupsOption = this.getGroupsOptionByProgramId(
                  //   programId as string | number
                  // );
                  // const groupId = first(groupsOption).value;
                  const lastProgramGroup =
                    selectedProgramsGroups[selectedProgramsGroupsLength - 1] ||
                    {};
                  if (
                    (lastProgramGroup.program && lastProgramGroup.group) ||
                    selectedProgramsGroupsLength === 0
                  ) {
                    const value = {
                      program: '',
                      group: '',
                      groupsOption: [],
                    };
                    arrayHelpers.push(value);
                  }
                },
              }}>
              + Add Program or Group
            </Button>
          </Grid>
        )}
      </div>
    );
  };

  render() {
    const {
      classes,
      handleChange,
      handleBlur,
      values,
      errors,
      touched,
      reader,
      notes,
      onListReadersRefresh,
      setFieldValue,
      isWriteAble,
    } = this.props;
    const { isOpenAddReaderNoteModal } = this.state;
    const userRole = capitalize(get(reader, 'role'));
    const userId = get(reader, 'id') || get(reader, 'user_id') || '';
    const readerName = `${get(reader, 'first_name') || ''} ${get(
      reader,
      'last_name'
    ) || ''} `;
    // const email = get(reader, 'email');

    return (
      <>
        <div>
          <div className={cx(classes.section, classes.informationSection)}>
            <div className={classes.heading}>
              <Heading headingProps={{ as: 'h3' }} type={HeadingType.BOLD_500}>
                Reader Information
              </Heading>
            </div>
            <Grid columns={3}>
              <Input
                inputProps={{
                  disabled: !isWriteAble,
                  placeholder: 'No Information Entered',
                  onChange: handleChange,
                  onBlur: handleBlur,
                  value: values.first_name,
                  name: 'first_name',
                }}
                label="First Name"
                errorMessage={
                  get(touched, 'first_name') && get(errors, 'first_name')
                }
              />
              <Input
                inputProps={{
                  disabled: !isWriteAble,
                  placeholder: 'No Information Entered',
                  onChange: handleChange,
                  onBlur: handleBlur,
                  value: values.last_name,
                  name: 'last_name',
                }}
                label="Last Name"
                errorMessage={
                  get(touched, 'last_name') && get(errors, 'last_name')
                }
              />
              <SingleDatePicker
                readonly={!isWriteAble}
                date={values.birthday ? moment(String(values.birthday)) : null}
                focused={false}
                onDateChange={d => {
                  if (d) {
                    setFieldValue('birthday', moment(d).format('YYYY-MM-DD'));
                  } else {
                    setFieldValue('birthday', null);
                  }
                }}
                label="Birthday"
                placeholder="Birth Date"
              />
              <Input
                inputProps={{
                  disabled: !isWriteAble,
                  placeholder: 'No Information Entered',
                  onChange: handleChange,
                  onBlur: handleBlur,
                  value: values.grade_level,
                  name: 'grade_level',
                }}
                label="Grade Level"
                errorMessage={
                  get(touched, 'grade_level') && get(errors, 'grade_level')
                }
              />
              <Input
                inputProps={{
                  disabled: !isWriteAble,
                  placeholder: 'No Information Entered',
                  onChange: handleChange,
                  onBlur: handleBlur,
                  value: values.school,
                  name: 'school',
                }}
                label="School"
                errorMessage={get(touched, 'school') && get(errors, 'school')}
              />
              <Input
                inputProps={{
                  disabled: !isWriteAble,
                  placeholder: 'No Information Entered',
                  onChange: handleChange,
                  onBlur: handleBlur,
                  value: values.library_card_number,
                  name: 'library_card_number',
                }}
                label="Library Card Number"
                errorMessage={
                  get(touched, 'library_card_number') &&
                  get(errors, 'library_card_number')
                }
              />
              {(userRole === UserRole.Parent ||
                (userRole === UserRole.Reader &&
                  !isInternalEmail(values.email))) && (
                <Input
                  inputProps={{
                    disabled: !isWriteAble,
                    placeholder: 'Email Address',
                    type: 'email',
                    onChange: handleChange,
                    onBlur: handleBlur,
                    value: values.email,
                    name: 'email',
                  }}
                  label="Email Address"
                  errorMessage={get(touched, 'email') && get(errors, 'email')}
                />
              )}
            </Grid>
            <React.Fragment>
              <div className={classes.headingChild}>
                <Heading
                  headingProps={{ as: 'h3' }}
                  type={HeadingType.BOLD_500}>
                  Reader's Address &amp; Phone Number
                </Heading>
              </div>
              <Grid columns={3}>
                <Input
                  inputProps={{
                    disabled: !isWriteAble,
                    placeholder: 'No Information Entered',
                    onChange: handleChange,
                    onBlur: handleBlur,
                    value: values.address1,
                    name: 'address1',
                  }}
                  label="Address 1"
                  errorMessage={
                    get(touched, 'address1') && get(errors, 'address1')
                  }
                />
                <Input
                  inputProps={{
                    disabled: !isWriteAble,
                    placeholder: 'No Information Entered',
                    onChange: handleChange,
                    onBlur: handleBlur,
                    value: values.address2,
                    name: 'address2',
                  }}
                  label="Address 2"
                  errorMessage={
                    get(touched, 'address2') && get(errors, 'address2')
                  }
                />
                <Input
                  inputProps={{
                    disabled: !isWriteAble,
                    placeholder: 'No Information Entered',
                    onChange: handleChange,
                    onBlur: handleBlur,
                    value: values.city,
                    name: 'city',
                  }}
                  label="City"
                  errorMessage={get(touched, 'city') && get(errors, 'city')}
                />
                <Input
                  inputProps={{
                    disabled: !isWriteAble,
                    placeholder: 'No Information Entered',
                    onChange: handleChange,
                    onBlur: handleBlur,
                    value: values.state,
                    name: 'state',
                  }}
                  label="State"
                  errorMessage={get(touched, 'state') && get(errors, 'state')}
                />
                <Input
                  inputProps={{
                    disabled: !isWriteAble,
                    placeholder: 'No Information Entered',
                    onChange: handleChange,
                    onBlur: handleBlur,
                    value: values.zip,
                    name: 'zip',
                  }}
                  label="ZIP"
                  errorMessage={get(touched, 'zip') && get(errors, 'zip')}
                />
                <Input
                  inputProps={{
                    disabled: !isWriteAble,
                    placeholder: 'No Information Entered',
                    onChange: handleChange,
                    onBlur: handleBlur,
                    value: values.country,
                    name: 'country',
                  }}
                  label="Country"
                  errorMessage={
                    get(touched, 'country') && get(errors, 'country')
                  }
                />
                <Input
                  inputProps={{
                    disabled: !isWriteAble,
                    placeholder: 'No Information Entered',
                    onChange: handleChange,
                    onBlur: handleBlur,
                    value: values.phone,
                    name: 'phone',
                  }}
                  label="Phone Number"
                  errorMessage={get(touched, 'phone') && get(errors, 'phone')}
                />
              </Grid>
            </React.Fragment>
            {(userRole === UserRole.Reader || userRole === UserRole.Child) &&
              values.parentData !== null && (
                <React.Fragment>
                  <div className={classes.headingChild}>
                    <Heading
                      headingProps={{ as: 'h3' }}
                      type={HeadingType.BOLD_500}>
                      Parent Information
                    </Heading>
                  </div>
                  <Grid columns={3}>
                    <Input
                      inputProps={{
                        disabled: !isWriteAble,
                        placeholder: 'No Information Entered',
                        onChange: handleChange,
                        onBlur: handleBlur,
                        value: values.parentData.first_name,
                        name: 'parentData.first_name',
                      }}
                      label="First Name"
                      errorMessage={get(errors, `parentData.first_name`)}
                    />
                    <Input
                      inputProps={{
                        disabled: !isWriteAble,
                        placeholder: 'No Information Entered',
                        onChange: handleChange,
                        onBlur: handleBlur,
                        value: values.parentData.last_name,
                        name: 'parentData.last_name',
                      }}
                      label="Last Name"
                      errorMessage={get(errors, `parentData.last_name`)}
                    />
                    <Input
                      inputProps={{
                        disabled: !isWriteAble,
                        placeholder: 'No Information Entered',
                        type: 'email',
                        onChange: handleChange,
                        onBlur: handleBlur,
                        value: values.parentData.email,
                        name: 'parentData.email',
                      }}
                      label="Email Address"
                      errorMessage={get(errors, `parentData.email`)}
                    />
                  </Grid>
                </React.Fragment>
              )}
            {/* {userRole === UserRole.Parent && ( */}
            {/*  <Grid> */}
            {/*    <Grid.Column> */}
            {/*      <ReSelect */}
            {/*        selectProps={{ */}
            {/*          value: values.programs, */}
            {/*          isMulti: true, */}
            {/*          options: map(programs, (item: any) => ({ */}
            {/*            value: Number(item.id), */}
            {/*            label: item.attributes.name, */}
            {/*          })), */}
            {/*          placeholder: 'No Information Entered', */}
            {/*          onChange: (items: any[]) => { */}
            {/*            setFieldValue('programs', items); */}
            {/*          }, */}
            {/*        }} */}
            {/*      /> */}
            {/*    </Grid.Column> */}
            {/*  </Grid> */}
            {/* )} */}
          </div>
          <div>
            {/* Program group */}
            {userRole !== UserRole.Parent && (
              <div className={cx(classes.section, classes.programGroupSection)}>
                <div className={classes.heading}>
                  <Heading
                    headingProps={{ as: 'h3' }}
                    type={HeadingType.BOLD_500}>
                    Programs
                  </Heading>
                </div>
                <FieldArray
                  name="programGroup"
                  component={this.renderProgramGroup}
                />
              </div>
            )}
            {/* Child program group */}
            {userRole === UserRole.Parent ? (
              <div className={cx(classes.section, classes.programGroupSection)}>
                <FieldArray
                  name="childProgramGroup"
                  component={this.renderChildProgramGroup}
                />
              </div>
            ) : null}
          </div>
          <div className={cx(classes.section, classes.noteSection)}>
            <div className={classes.heading}>
              <Heading headingProps={{ as: 'h3' }} type={HeadingType.BOLD_500}>
                Notes
              </Heading>
            </div>
            <Grid>
              <Grid.Column textAlign="left" verticalAlign="middle">
                <div>
                  <Heading
                    headingProps={{ as: 'h4' }}
                    type={HeadingType.BOLD_500}>
                    <ReaderNoteSvg height={19} />
                    Note Details:
                  </Heading>
                </div>
              </Grid.Column>
            </Grid>
            <Grid>
              <Grid.Column>
                <div className={classes.notesContainer}>
                  <List className={classes.notesList}>
                    {map(notes, (note: INoteData, index: string | number) => (
                      <List.Item key={index}>
                        <List.Header className={classes.noteTime}>
                          {moment(idx(note, x => x.created_at)).format(
                            'MM/DD/YYYY hh:ss a'
                          )}{' '}
                          {`${idx(
                            note,
                            x => x.created_by_user.first_name
                          )} ${idx(note, x => x.created_by_user.last_name)}`}
                          :
                        </List.Header>
                        <p className={classes.noteText}>
                          {idx(note, x => x.note_text)}
                        </p>
                      </List.Item>
                    ))}
                  </List>
                  {isWriteAble && (
                    <Button
                      colorVariant={ButtonColor.MAIN}
                      buttonType={ButtonType.ROUND}
                      buttonProps={{
                        type: 'button',
                        onClick: () => {
                          this.toggleAddReaderNoteModal();
                        },
                      }}>
                      + Add note
                    </Button>
                  )}
                </div>
              </Grid.Column>
            </Grid>
          </div>
        </div>
        <AddReaderNoteModal
          modelProps={{
            closeIcon: true,
            open: isOpenAddReaderNoteModal,
            size: 'small',
            onClose: this.toggleAddReaderNoteModal,
          }}
          onCancel={this.toggleAddReaderNoteModal}
          userId={userId}
          onListReadersRefresh={onListReadersRefresh}
          notes={notes}
          readerName={readerName}
        />
      </>
    );
  }
}

export default UpdateReaderForm;
