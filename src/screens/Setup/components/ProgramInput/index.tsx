import * as React from 'react';
import Select from 'src/components/FormFields/Select';
import themr from 'src/helpers/themr';
import styles from '../../styles.scss';

export type Props = IComponentProps & {
  formProps: any;
  programOptions: any[];
  onChange?: Function;
};

const ProgramInput = props => {
  const { classes, programOptions, formProps, onChange } = props;
  const { values, setFieldValue, setFieldTouched } = formProps;
  return (
    <Select
      selectProps={{
        className: classes.select,
        options: programOptions,
        placeholder: 'Program Name',
        value: values.program,
        onChange: (_, data) => {
          if (onChange) {
            onChange(data.value);
          }
          setFieldValue('program', data.value);
          setFieldTouched('program');
          setFieldValue('group', '');
          setFieldValue('metric', '');
          setFieldValue('metricId', '');
          setFieldValue('goalId', '');
          setFieldValue('yesNo', '');
          setFieldValue('book', '');
        },
      }}
    />
  );
};

export default themr<Props>('ProgramInput', styles)(ProgramInput);
