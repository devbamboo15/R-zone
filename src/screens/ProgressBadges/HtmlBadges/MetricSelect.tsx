import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import ReSelect from 'src/components/ReSelect';
import Label from 'src/components/FormFields/Label';

const MetricSelect = props => {
  const {
    metricOptions,
    formProps,
    handleGetLeaderboard,
    getReadingLog,
    classes,
  } = props;
  const { values, setFieldValue } = formProps;

  return (
    <Grid.Column>
      <Label classes={{ labelStyle: classes.label }}>Metric</Label>
      <ReSelect
        selectProps={{
          options: metricOptions,
          isMulti: true,
          value: values.metric,
          name: 'metric',
          className: classes.multipleSelect,
          onChange: value => {
            setFieldValue('metric', value);
            handleGetLeaderboard(
              {
                ...values,
                metric: value,
              },
              getReadingLog(values.program)
            );
          },
          placeholder: 'Select Metric',
        }}
      />
    </Grid.Column>
  );
};

export default MetricSelect;
