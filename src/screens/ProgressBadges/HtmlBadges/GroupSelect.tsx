import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import Select from 'src/components/FormFields/Select';
import ReSelect from 'src/components/ReSelect';
import Label from 'src/components/FormFields/Label';

const GroupSelect = props => {
  const {
    isLeaderBoard,
    groupOptions,
    formProps,
    handleGetLeaderboard,
    getReadingLog,
    classes,
  } = props;
  const { values, setFieldValue } = formProps;
  const [isChange, setIsChange] = React.useState(false);

  return (
    <Grid.Column width={4}>
      {isLeaderBoard ? (
        <Select
          selectProps={{
            options: groupOptions,
            value: values.group,
            name: 'group',
            onChange: (_, data) => {
              setFieldValue('group', data.value);
              handleGetLeaderboard(
                {
                  ...values,
                  group: data.value,
                },
                getReadingLog(values.program)
              );
            },
            placeholder: 'Select Group',
            disabled:
              values.badge_type === '' || getReadingLog(values.program) === 2,
          }}
          label="Groups"
        />
      ) : (
        <>
          <Label classes={{ labelStyle: classes.label }}>Groups</Label>
          <ReSelect
            selectProps={{
              options: groupOptions,
              isMulti: true,
              closeMenuOnSelect: false,
              value: values.group,
              name: 'group',
              className: classes.multipleSelect,
              onBlur: () => {
                if (isChange) {
                  handleGetLeaderboard(values, getReadingLog(values.program));
                  setIsChange(false);
                }
              },
              onChange: value => {
                setIsChange(true);
                setFieldValue('group', value);
                if (value.length === 0) {
                  handleGetLeaderboard(
                    {
                      ...values,
                      group: [],
                    },
                    getReadingLog(values.program)
                  );
                  setIsChange(false);
                }
              },
              isDisabled: !values.program || values.program.length === 0,
              placeholder: values.program ? 'All Groups' : 'Select Groups',
            }}
          />
        </>
      )}
    </Grid.Column>
  );
};

export default GroupSelect;
