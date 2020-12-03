import * as React from 'react';
import get from 'lodash/get';
import cn from 'classnames';
import Button, { ButtonType } from 'src/components/Button';
import Input from 'src/components/FormFields/Input';
import PlusWithoutCircleSvg from 'src/assets/icons/plusWithoutCircle.svg';
import ReSelect from 'src/components/ReSelect';
import { Formik } from 'formik';
import * as Yup from 'yup';
import HelperIcon from 'src/components/Helper/Icon';
import HelpCircleSvg from 'src/assets/icons/HelpCircle.svg';

import InputSearch from '../InputSearch';

export type NewReaderProps = IComponentProps & {
  parentFormProps: any;
  onFinishCb: Function;
  addMeChild?: Function;
  addMeChildData?: Function;
  updateMeChildDetails?: Function;
  joinGoal?: Function;
  addMeChildLoading?: boolean;
  joinGoalLoading?: boolean;
  getBooksReading?: Function;
};

const NewReader = props => {
  const {
    classes,
    parentFormProps,
    onFinishCb,
    addMeChild,
    addMeChildData,
    updateMeChildDetails,
    joinGoal,
    addMeChildLoading,
    joinGoalLoading,
    getBooksReading,
  } = props;

  const onSubmit = values => {
    const { setFieldValue } = parentFormProps;
    const groups = get(values, 'group') || [];
    addMeChild(
      {
        first_name: get(values, 'firstName', ''),
        last_name: get(values, 'lastName', ''),
        goal_id: get(groups, '[0].goalId', ''),
      },
      user => {
        const userAttributes = get(user, 'attributes') || {};
        addMeChildData({
          ...user,
          type: 'user',
          attributes: {
            ...userAttributes,
            name: `${userAttributes.first_name} ${userAttributes.last_name}`,
          },
        });
        const newProgram = {
          ...(get(values, 'selectedProgram.attributes') || {}),
          id: get(values, 'selectedProgram.id', ''),
        };
        newProgram.groups = values.group.map(g => {
          return {
            id: g.value,
            name: g.label,
            active_metric_id: g.metricId,
            active_goal_id: g.goalId,
          };
        });
        updateMeChildDetails({
          programs: [newProgram],
        });
        const userId = get(user, 'id', '');
        joinGoal(groups.map(g => g.goalId) || [], userId, () => {
          getBooksReading(userId);
          setFieldValue('reader', userId);
          setFieldValue('program', get(values, 'selectedProgram.id', ''));
          setFieldValue('group', get(values, 'group[0].value', ''));
          setFieldValue('metricId', get(values, 'group[0].metricId', ''));
          setFieldValue('goalId', get(values, 'group[0].goalId', ''));
          onFinishCb();
        });
      }
    );
  };

  return (
    <div className={classes.step}>
      <label>
        1a) <b>Reader Information</b>:
      </label>
      <div className={classes.createNewForm}>
        <Formik
          onSubmit={onSubmit}
          initialValues={{
            firstName: '',
            lastName: '',
            program: '',
            isSelectedProgram: '',
            group: '',
          }}
          validationSchema={Yup.object().shape({
            firstName: Yup.string().required('First Name is required'),
            lastName: Yup.string().required('Last Name is required'),
            program: Yup.string().required('Program is required'),
            isSelectedProgram: Yup.string().required('Program is required'),
            selectedProgram: Yup.string().required('Program is required'),
            group: Yup.string().required('Group is required'),
          })}>
          {formProps => {
            const {
              values,
              handleChange,
              setFieldValue,
              handleSubmit,
              dirty,
              isValid,
            } = formProps;
            const inputSearchProps = {
              handleChange,
              value: values.program,
              onChange: () => {
                setFieldValue('isSelectedProgram', '');
                setFieldValue('selectedProgram', '');
                setFieldValue('selectedProgramGroups', '');
                setFieldValue('group', '');
              },
              onSelect: (program, groups) => {
                setFieldValue('isSelectedProgram', 'true');
                setFieldValue('selectedProgram', program);
                setFieldValue('selectedProgramGroups', groups);
                setFieldValue('program', get(program, 'attributes.name'));
              },
              name: 'program',
              placeholder: 'Program Code',
            };
            const groupOptions = (
              get(values, 'selectedProgramGroups') || []
            ).map(g => {
              return {
                value: g.id.toString(),
                label: g.attributes.name,
                metricId: g.attributes.active_metric_id,
                goalId: g.attributes.active_goal_id,
              };
            });
            return (
              <>
                <div>
                  <Input
                    inputProps={{
                      placeholder: 'First Name',
                      name: 'firstName',
                      value: values.firstName,
                      onChange: handleChange,
                    }}
                  />
                  <Input
                    inputProps={{
                      placeholder: 'Last Name',
                      name: 'lastName',
                      value: values.lastName,
                      onChange: handleChange,
                    }}
                  />
                </div>
                <div>
                  <div className="position-relative">
                    <HelperIcon
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '-25px',
                      }}
                      position="left center"
                      content={<HelpCircleSvg />}
                      helperText="Please enter the 5 character code provided by your school or library to find a reading program. If you do not have a code, please contact the sponsoring organization."
                    />
                    <InputSearch {...inputSearchProps} />
                  </div>
                  <ReSelect
                    selectProps={{
                      options: groupOptions,
                      isDisabled: !values.program || !values.isSelectedProgram,
                      placeholder: 'Group Name',
                      value: values.group,
                      onChange: val => {
                        setFieldValue('group', val);
                      },
                      className: classes.reSelect,
                      isMulti: true,
                      hideSelectedOptions: false,
                      optionWithCheckbox: true,
                      multiLabel: 'Groups',
                      isClearable: false,
                      closeMenuOnSelect: false,
                      selectIndicator: true,
                    }}
                  />
                </div>
                <div>
                  <Button
                    buttonType={ButtonType.ROUND}
                    icon={<PlusWithoutCircleSvg size={20} />}
                    btnClass={cn(classes.button, classes.createBtn)}
                    buttonProps={{
                      size: 'large',
                      type: 'button',
                      disabled: !dirty || !isValid,
                      onClick: () => {
                        handleSubmit();
                      },
                      loading: addMeChildLoading || joinGoalLoading,
                    }}>
                    Create Reader
                  </Button>
                </div>
              </>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default NewReader;
