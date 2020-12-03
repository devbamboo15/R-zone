import * as React from 'react';
import Input from 'src/components/FormFields/Input';
import Const from 'src/helpers/const';
import themr from 'src/helpers/themr';
import Checkbox from 'src/components/FormFields/Checkbox';
import { MetricText } from 'src/store/types';
import styles from '../../styles.scss';

export type Props = IComponentProps & {
  metricId?: string;
  formProps: any;
};

export const yesNoMetricLabel = (groupTitle: string) => {
  return (
    <>
      Did you <b>{groupTitle}</b> today?:
    </>
  );
};

export const metricLabel = metricId => {
  return (
    <>
      <b>Enter</b> the number of <b>{MetricText[metricId]}</b> you have read
      today:
    </>
  );
};

const MetricInput = props => {
  const { formProps, metricId, classes } = props;
  const { values, handleChange, handleBlur, setFieldValue } = formProps;
  if (metricId === 'yes/no') {
    return (
      <div className={classes.yesNoWrapper}>
        <Checkbox
          checkboxProps={{
            radio: true,
            checked: values.yesNo === true,
            label: 'Yes',
            onClick: () => {
              setFieldValue('yesNo', true);
            },
          }}
        />
        <Checkbox
          checkboxProps={{
            radio: true,
            checked: values.yesNo === false,
            label: 'No',
            onClick: () => {
              setFieldValue('yesNo', false);
            },
          }}
        />
      </div>
    );
  }
  return (
    <Input
      inputProps={{
        placeholder: MetricText[metricId],
        name: 'metric',
        maxLength: 4,
        value: values.metric,
        onChange: e => {
          const val = e.target.value;
          if (val !== '0' && val.match(Const.NUMBER_PATTERN)) {
            handleChange(e);
            setFieldValue('book', '');
          }
        },
        onBlur: handleBlur,
      }}
    />
  );
};

export default themr<Props>('MetricInput', styles)(MetricInput);
