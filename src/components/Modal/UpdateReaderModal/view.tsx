import * as React from 'react';
import * as moment from 'moment';
import { map, keys, get, forEach } from 'lodash';
import Modal, { BaseModalProps } from 'src/components/Modal';
import { Grid, Label, Tab, Menu, Icon } from 'semantic-ui-react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import BulkReaderSvg from 'src/assets/icons/bulk_reader.svg';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import Heading, { HeadingType } from 'src/components/Heading';
import UpdateReaderForm from 'src/components/Forms/UpdateReaderForm';
import { IReaderItem, INoteData } from 'src/store/types/common';
import Spinner from 'src/components/Spinner';
import idx from 'idx';
import { UserRole } from 'src/store/types/organizer/reader';
import BookBank from './BookBank';
import Trophies from './Trophies';

export type UpdateReaderModalProps = IComponentProps & {
  readerData: any;
  parentData: any;
  readerLoading: boolean;
  updateReaderLoading: boolean;
  onSaveReader: Function;
  programGroups: any;
  organizationId: string | number;
  trophies: any[];
  notes: INoteData[];
  childData: any[];
  parentProgram: any[];
  readerProgramGroup: any[];
  userAccessProgram: any;
  accessGroupByProgram?: any;
  programId?: any;
  groupId?: any;
  role: string;
  userQuestions: any;
  userQuestionsLoading: boolean;
};
export type UpdateReaderModalOutProps = BaseModalProps & {
  reader: IReaderItem;
  onCancel: Function;
  onDeleteReader?: Function;
  onListReadersRefresh: Function;
  afterUpdateReader?: Function;
  programId?: string;
  groupId?: string;
};
class UpdateReaderModal extends React.Component<
  UpdateReaderModalProps & UpdateReaderModalOutProps,
  {}
> {
  onUpdateFormSubmit = (values: any) => {
    const { onSaveReader } = this.props;
    onSaveReader(values);
  };

  getValidationSchema() {
    const { reader, parentData } = this.props;
    const userRole = get(reader, 'role');

    if (
      (userRole === UserRole.Reader || userRole === UserRole.Child) &&
      parentData !== null
    ) {
      return Yup.object().shape({
        first_name: Yup.string().required('First name is Required'),
        last_name: Yup.string().required('Last name is Required'),
        parentData: Yup.object().shape({
          first_name: Yup.string().required('First name is required'),
          last_name: Yup.string().required('Last name is required'),
          email: Yup.string()
            .email('Email is not valid')
            .required('Email is Required'),
        }),
        programGroup: Yup.array()
          .of(
            Yup.object().shape({
              program: Yup.string().required('Program is required'),
              group: Yup.string().required('Group is required'),
            })
          )
          .required('Must have program or group'),
        childProgramGroup: Yup.array().of(
          Yup.object().shape({
            email: Yup.string()
              .email('Email is not valid')
              .required('Email is Required'),
            first_name: Yup.string().required('First name is required'),
            last_name: Yup.string().required('Last name is required'),
            programGroupData: Yup.array().of(
              Yup.object().shape({
                program: Yup.string().required('Program is required'),
                group: Yup.string().required('Group is required'),
              })
            ),
          })
        ),
      });
    }

    return Yup.object().shape({
      first_name: Yup.string().required('First name is Required'),
      last_name: Yup.string().required('Last name is Required'),
      email: Yup.string()
        .email('Email is not valid')
        .required('Email is Required'),
      programGroup: Yup.array()
        .of(
          Yup.object().shape({
            program: Yup.string().required('Program is required'),
            group: Yup.string().required('Group is required'),
          })
        )
        .required('Must have program or group'),
      childProgramGroup: Yup.array().of(
        Yup.object().shape({
          // email: Yup.string()
          //   .email('Email is not valid')
          //   .required('Email is Required'),
          first_name: Yup.string().required('First name is required'),
          last_name: Yup.string().required('Last name is required'),
          programGroupData: Yup.array().of(
            Yup.object().shape({
              program: Yup.string().required('Program is required'),
              group: Yup.string().required('Group is required'),
            })
          ),
        })
      ),
    });
  }

  renderEditTab = () => {
    const {
      classes,
      onCancel,
      reader,
      updateReaderLoading,
      programGroups,
      onListReadersRefresh,
      readerData,
      parentData,
      notes,
      childData,
      parentProgram,
      readerProgramGroup,
      onDeleteReader,
      userQuestionsLoading,
      userQuestions,
    } = this.props;
    const userRole = get(reader, 'role');
    const programGroup = map(readerProgramGroup, (iProgram: any) => {
      const groups = idx(programGroups, x => x[iProgram.program_id].data || []);
      const groupsOption = map(groups, (iGroup: any) => ({
        text: iGroup.attributes.name,
        value: Number(iGroup.id),
      }));
      return {
        program: iProgram.program_id,
        group: iProgram.group_id,
        groupsOption,
      };
    });
    const group = get(reader, 'group', []);
    const isWriteAble = this.isWriteAble(group);

    let childProgramGroup = [] as any;
    if (userRole === UserRole.Parent) {
      childProgramGroup = map(childData, (child: any) => {
        const programGroupData = map(
          get(child, 'program_group'),
          (iChild: any) => {
            const groups = idx(
              programGroups,
              x => x[iChild.program_id].data || []
            );
            const groupsOption = map(groups, (iGroup: any) => ({
              text: iGroup.attributes.name,
              value: Number(iGroup.id),
            }));
            return {
              program: iChild.program_id,
              group: iChild.group_id,
              groupsOption,
            };
          }
        );
        return {
          id: get(child, 'id'),
          email: get(child, 'email', ''),
          first_name: get(child, 'first_name', ''),
          last_name: get(child, 'last_name', ''),
          programGroupData,
        };
      });
    }

    let userPrograms = [] as any;
    if (userRole === UserRole.Parent) {
      userPrograms = map(parentProgram, (iProgram: any) => {
        return {
          value: iProgram.id,
          label: iProgram.name,
        };
      });
    }
    const readerId = get(reader, 'user_id');
    let currentUserQuestions = [];
    let birthday;
    let gradeLevel;
    let school;
    let libraryCardNumber;
    let address1;
    let address2;
    let city;
    let state;
    let zip;
    let country;
    let phone;
    if (readerId || !userQuestionsLoading) {
      currentUserQuestions = idx(userQuestions, x => x[readerId]) || [];
      birthday = currentUserQuestions.filter(x => x.id === '2');
      if (birthday.length) {
        birthday = get(birthday[0], 'attributes.answer', null);
      } else {
        birthday = null;
      }
      gradeLevel = currentUserQuestions.filter(x => x.id === '5');
      if (gradeLevel.length) {
        gradeLevel = get(gradeLevel[0], 'attributes.answer', '') || '';
      } else {
        gradeLevel = '';
      }
      libraryCardNumber = currentUserQuestions.filter(x => x.id === '3');
      if (libraryCardNumber.length) {
        libraryCardNumber =
          get(libraryCardNumber[0], 'attributes.answer', '') || '';
      } else {
        libraryCardNumber = '';
      }
      school = currentUserQuestions.filter(x => x.id === '4');
      if (school.length) {
        school = get(school[0], 'attributes.answer', '') || '';
      } else {
        school = '';
      }

      let completeAddress = currentUserQuestions.filter(x => x.id === '1');
      if (completeAddress.length) {
        completeAddress = get(completeAddress[0], 'attributes.answer', {});
        address1 = get(completeAddress, 'address1', '') || '';
        address2 = get(completeAddress, 'address2', '') || '';
        city = get(completeAddress, 'city', '') || '';
        state = get(completeAddress, 'state', '') || '';
        zip = get(completeAddress, 'zip', '') || '';
        country = get(completeAddress, 'country', '') || '';
        phone = get(completeAddress, 'phone', '') || '';
      } else {
        address1 = '';
        address2 = '';
        city = '';
        state = '';
        zip = '';
        country = '';
        phone = '';
      }
    }
    const initialValues = {
      first_name: readerData.first_name,
      last_name: readerData.last_name,
      email: readerData.email || '',
      birthday,
      grade_level: gradeLevel || '',
      school: school || '',
      library_card_number: libraryCardNumber || '',
      address1: address1 || '',
      address2: address2 || '',
      city: city || '',
      state: state || '',
      zip: zip || '',
      country: country || '',
      phone: phone || '',
      parentData: parentData || null,
      programGroup,
      childProgramGroup,
      programs: userPrograms,
    };

    return (
      <Tab.Pane className={classes.tabContent} attached={false}>
        <Formik
          initialValues={{ ...initialValues }}
          enableReinitialize
          onSubmit={this.onUpdateFormSubmit}
          validationSchema={this.getValidationSchema()}>
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            setFieldValue,
          }) => {
            return (
              <Form>
                <div>
                  <UpdateReaderForm
                    errors={errors}
                    values={values}
                    touched={touched}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    setFieldValue={setFieldValue}
                    reader={reader}
                    readerData={readerData}
                    notes={notes}
                    onListReadersRefresh={onListReadersRefresh}
                    existingProgramGroup={programGroup}
                    isWriteAble={isWriteAble}
                  />
                </div>
                <Grid>
                  <Grid.Row textAlign="center" verticalAlign="middle">
                    <div className={classes.bottomButtons}>
                      {isWriteAble && (
                        <>
                          <Button
                            colorVariant={ButtonColor.PRIMARY}
                            buttonType={ButtonType.ROUND}
                            buttonProps={{
                              loading: updateReaderLoading,
                              disabled: keys(errors).length !== 0,
                              type: 'submit',
                            }}>
                            Save
                          </Button>
                          <Button
                            icon={<Icon name="trash alternate outline" />}
                            colorVariant={ButtonColor.DANGER}
                            buttonType={ButtonType.ROUND}
                            buttonProps={{
                              type: 'button',
                              onClick: () => onDeleteReader(),
                            }}>
                            Delete Reader
                          </Button>
                        </>
                      )}
                      <Button
                        colorVariant={ButtonColor.GRAY}
                        buttonType={ButtonType.ROUND}
                        buttonProps={{
                          type: 'button',
                          onClick: () => onCancel(),
                        }}>
                        Cancel
                      </Button>
                    </div>
                  </Grid.Row>
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </Tab.Pane>
    );
  };

  renderTrophiesTab = () => {
    const { classes, trophies } = this.props;
    return (
      <Tab.Pane className={classes.tabContent}>
        <Trophies trophies={trophies} />
      </Tab.Pane>
    );
  };

  renderBookBankTab = () => {
    const { classes, reader } = this.props;
    const group = get(reader, 'group', []);
    const isWriteAble = this.isWriteAble(group);
    return (
      <Tab.Pane className={classes.tabContent}>
        <BookBank reader={reader} isWriteAble={isWriteAble} />
      </Tab.Pane>
    );
  };

  isWriteAble = group => {
    if (group.length > 0) {
      const { userAccessProgram } = this.props;
      let writeAble = false;
      forEach(group, itemGroup => {
        const itemRole = get(
          userAccessProgram,
          `group_by_program[${itemGroup.program_id}][${itemGroup.id}]`
        );
        if (itemRole && itemRole.write === true) {
          writeAble = true;
        }
      });
      return writeAble;
    }

    const { accessGroupByProgram } = this.props;
    return accessGroupByProgram.write === true;
  };

  render() {
    const {
      modelProps,
      classes,
      readerData,
      readerLoading,
      userQuestionsLoading,
    } = this.props;
    const panes = [
      {
        menuItem: <Menu.Item key="edit">Edit Reader</Menu.Item>,
        render: () => this.renderEditTab(),
      },
      {
        menuItem: <Menu.Item key="trophies">Awards</Menu.Item>,
        render: () => this.renderTrophiesTab(),
      },
      {
        menuItem: <Menu.Item key="bookBank">Book Bank</Menu.Item>,
        render: () => this.renderBookBankTab(),
      },
    ];

    return (
      <Modal modelProps={{ ...modelProps }}>
        <div className={classes.modalContent}>
          <div className={classes.modalTop}>
            <BulkReaderSvg height={60} />
            <div className={classes.header} style={{ marginTop: '0.75rem' }}>
              <Heading headingProps={{ as: 'h3' }} type={HeadingType.BOLD_600}>
                Edit Reader:{' '}
                {`${idx(readerData, x => x.first_name)} ${idx(
                  readerData,
                  x => x.last_name
                )}`}
              </Heading>
            </div>
            <Label className={classes.joinedText}>
              Joined{' '}
              {moment(readerData.joined_date, 'MM/DD/YYYY').format(
                'MM/DD/YYYY'
              )}
            </Label>
          </div>
          <div className={classes.tabContainer}>
            <Tab
              menu={{ color: 'green', secondary: true, pointing: true }}
              panes={panes}
            />
          </div>
        </div>
        {(readerLoading || userQuestionsLoading) && (
          <div className={classes.loadingContainer}>
            <Spinner />
          </div>
        )}
      </Modal>
    );
  }
}
export default UpdateReaderModal;
