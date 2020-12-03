import * as React from 'react';
import find from 'lodash/find';
import get from 'lodash/get';
import Select from 'src/components/FormFields/Select';
import Loading from '../Loading';

export type GroupInputProps = IComponentProps & {
  formProps: any;
  groupOptions: any[];
  onChange?: Function;
  serchProgramsLoading?: boolean;
  searchGoalCodes?: Function;
  selectedProgram: any;
};

const GroupInput = props => {
  const {
    classes,
    groupOptions,
    formProps,
    onChange,
    searchGoalCodes,
    selectedProgram,
    serchProgramsLoading,
  } = props;
  const { values, setFieldValue, setFieldTouched } = formProps;
  return (
    <>
      {serchProgramsLoading && <Loading />}
      <Select
        selectProps={{
          className: classes.select,
          options: groupOptions,
          placeholder: 'Group Name',
          value: values.group,
          onChange: (_, data) => {
            const value = get(data, 'value', '');
            const foundOption = find(groupOptions, { value }) || {};
            setFieldValue('group', value);
            setFieldValue('metricId', foundOption.metricId);
            setFieldValue('goalId', foundOption.goalId);
            setFieldTouched('group');
            setFieldValue('metric', '');
            setFieldValue('yesNo', '');
            if (onChange) {
              onChange(foundOption.metricId, value);
            }
            if (data.value === 'new') {
              searchGoalCodes(get(selectedProgram, 'code', ''));
            }
          },
        }}
      />
    </>
  );
};

export default GroupInput;
