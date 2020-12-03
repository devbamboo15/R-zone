import * as React from 'react';
import Select from 'src/components/FormFields/Select';
import get from 'lodash/get';

export type ReaderInputProps = IComponentProps & {
  formProps: any;
  readerOptions: any[];
  setStep: Function;
  resetSearchGoalCodes?: Function;
  getBooksReading?: Function;
  getMeChildDetails?: Function;
  onChange?: Function;
};

const ReaderInput = props => {
  const {
    classes,
    readerOptions,
    formProps,
    resetSearchGoalCodes,
    setStep,
    getBooksReading,
    getMeChildDetails,
    onChange,
  } = props;
  const { values, setFieldValue, setFieldTouched } = formProps;
  return (
    <Select
      selectProps={{
        className: classes.select,
        options: readerOptions,
        placeholder: 'Reader Name',
        value: values.reader,
        onChange: (_, data) => {
          const value = get(data, 'value', '');
          setFieldValue('reader', value);
          setFieldValue('program', '');
          setFieldValue('group', '');
          setFieldValue('metric', '');
          setFieldTouched('reader');
          if (value === 'new') {
            resetSearchGoalCodes();
            setStep(1);
          } else {
            getMeChildDetails(value);
            getBooksReading(value);
          }
          if (onChange) {
            onChange(value);
          }
        },
      }}
    />
  );
};

export default ReaderInput;
