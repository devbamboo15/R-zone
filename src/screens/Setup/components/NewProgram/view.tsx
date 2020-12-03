import * as React from 'react';
import get from 'lodash/get';
import findIndex from 'lodash/findIndex';
import cn from 'classnames';
import Button, { ButtonType } from 'src/components/Button';
import PlusWithoutCircleSvg from 'src/assets/icons/plusWithoutCircle.svg';
import ReSelect from 'src/components/ReSelect';
import { Formik } from 'formik';
import * as Yup from 'yup';

import InputSearch from '../InputSearch';

export type NewProgramProps = IComponentProps & {
  step?: number;
  childActiveGroupIds?: any[];
  parentFormProps: any;
  onFinishCb: Function;
  joinGoal?: Function;
  updateMeChildDetails?: Function;
  getBooksReading?: Function;
  programs: any[];
  joinGoalLoading?: boolean;
  role: string;
  updateMeProgram?: Function;
};

const NewProgram = props => {
  const {
    classes,
    step,
    childActiveGroupIds,
    parentFormProps,
    onFinishCb,
    joinGoal,
    programs,
    updateMeChildDetails,
    joinGoalLoading,
    role,
    getBooksReading,
    updateMeProgram,
  } = props;

  const onSubmit = currentValues => {
    const { values, setFieldValue } = parentFormProps;
    const groups = get(currentValues, 'group') || [];
    // add program and group into reader
    const readerId = role === 'reader' ? null : values.reader;
    joinGoal(groups.map(g => g.goalId) || [], readerId, () => {
      getBooksReading(readerId);
      const newProgramId = get(currentValues, 'selectedProgram.id', '');
      const newPrograms = [...programs];
      const foundIndex = findIndex(newPrograms, { id: newProgramId });
      const newGroups = groups.map(g => {
        return {
          id: g.value,
          name: g.label,
          active_metric_id: g.metricId,
          active_goal_id: g.goalId,
        };
      });
      if (foundIndex >= 0) {
        newPrograms[foundIndex].groups = [
          ...(newPrograms[foundIndex].groups || []),
          ...newGroups,
        ];
      } else {
        const newProgram = {
          ...(get(currentValues, 'selectedProgram.attributes') || {}),
          id: get(currentValues, 'selectedProgram.id', ''),
        };
        newProgram.groups = newGroups;
        newPrograms.push(newProgram);
      }
      if (role === 'reader') {
        updateMeProgram(newPrograms);
      } else {
        updateMeChildDetails({
          programs: newPrograms,
        });
      }
      setFieldValue('program', get(currentValues, 'selectedProgram.id', ''));
      if (groups.length === 1) {
        setFieldValue('group', get(groups, '[0].value', ''));
        setFieldValue('metricId', get(groups, '[0].metricId', ''));
        setFieldValue('goalId', get(groups, '[0].goalId', ''));
      }
      onFinishCb();
    });
  };

  return (
    <div className={classes.step}>
      <label>
        {step || 2}a) <b>Enter</b> your program code below:
      </label>
      <div className={classes.createNewProgram}>
        <Formik
          onSubmit={onSubmit}
          initialValues={{
            program: '',
            isSelectedProgram: '',
            group: '',
          }}
          validationSchema={Yup.object().shape({
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
            const groupOptions = (get(values, 'selectedProgramGroups') || [])
              .filter(g => !childActiveGroupIds.includes(g.id.toString()))
              .map(g => {
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
                  <InputSearch {...inputSearchProps} />
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
                      loading: joinGoalLoading,
                      onClick: () => {
                        handleSubmit();
                      },
                    }}>
                    Join
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

export default NewProgram;
