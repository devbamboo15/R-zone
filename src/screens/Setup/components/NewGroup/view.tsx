import * as React from 'react';
import cn from 'classnames';
import Button, { ButtonType } from 'src/components/Button';
import PlusWithoutCircleSvg from 'src/assets/icons/plusWithoutCircle.svg';
import ReSelect from 'src/components/ReSelect';
import { Formik } from 'formik';
import get from 'lodash/get';
import findIndex from 'lodash/findIndex';
import * as Yup from 'yup';

export type NewGroupProps = IComponentProps & {
  step?: number;
  groupOptions: any[];
  parentFormProps: any;
  programs: any[];
  onFinishCb: Function;
  joinGoal?: Function;
  updateMeChildDetails?: Function;
  getBooksReading?: Function;
  role: string;
  joinGoalLoading?: boolean;
  updateMeProgram?: Function;
};

const NewGroup = props => {
  const {
    classes,
    step,
    groupOptions,
    parentFormProps,
    joinGoal,
    programs,
    updateMeChildDetails,
    onFinishCb,
    role,
    getBooksReading,
    joinGoalLoading,
    updateMeProgram,
  } = props;

  const onSubmit = currentValues => {
    const { values, setFieldValue } = parentFormProps;
    const groups = get(currentValues, 'group') || [];
    const readerId = role === 'reader' ? null : values.reader;
    joinGoal(groups.map(g => g.goalId) || [], readerId, () => {
      getBooksReading(readerId);
      const newPrograms = [...programs];
      const foundIndex = findIndex(newPrograms, { id: values.program });
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
      }
      if (role === 'reader') {
        updateMeProgram(newPrograms);
      } else {
        updateMeChildDetails({
          programs: newPrograms,
        });
      }
      const onlyOneGroup = currentValues.group.length === 1;
      setFieldValue(
        'group',
        onlyOneGroup ? get(currentValues, 'group[0].value', '') : ''
      );
      setFieldValue(
        'metricId',
        onlyOneGroup ? get(currentValues, 'group[0].metricId', '') : ''
      );
      setFieldValue(
        'goalId',
        onlyOneGroup ? get(currentValues, 'group[0].goalId', '') : ''
      );
      onFinishCb();
    });
  };

  return (
    <div className={classes.step}>
      <label>
        {step || 3}a) <b>Choose</b> the group(s) you would like to join:
      </label>
      <div className={classes.createNewGroup}>
        <Formik
          onSubmit={onSubmit}
          initialValues={{
            group: '',
          }}
          validationSchema={Yup.object().shape({
            group: Yup.string().required('Group is required'),
          })}>
          {formProps => {
            const {
              values,
              setFieldValue,
              handleSubmit,
              dirty,
              isValid,
            } = formProps;
            return (
              <>
                <div>
                  <ReSelect
                    selectProps={{
                      options: groupOptions,
                      placeholder: 'Group Name',
                      value: values.group,
                      onChange: val => {
                        setFieldValue('group', val);
                      },
                      className: classes.reSelect,
                      selectIndicator: true,
                      isMulti: true,
                      hideSelectedOptions: false,
                      optionWithCheckbox: true,
                      multiLabel: 'Groups',
                      isClearable: false,
                      closeMenuOnSelect: false,
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
                      loading: joinGoalLoading,
                    }}>
                    Join Group
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

export default NewGroup;
