import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import { Grid } from 'semantic-ui-react';
import Select from 'src/components/FormFields/Select';
import ReSelect from 'src/components/ReSelect';
import Label from 'src/components/FormFields/Label';

const ProgramSelect = props => {
  const {
    renderProgramOption,
    formProps,
    handleGetLeaderboard,
    getReadingLog,
    classes,
  } = props;
  const { values, setFieldValue } = formProps;
  const [isOpen, setIsOpen] = React.useState(false);
  const [isChange, setIsChange] = React.useState(false);

  return (
    <Grid.Column width={4}>
      {values.badge_type === '1' ? (
        <Select
          selectProps={{
            options: renderProgramOption(),
            value: values.program,
            name: 'program',
            onChange: (_, data) => {
              setFieldValue('program', data.value);
              handleGetLeaderboard(
                {
                  ...values,
                  group: '',
                  program: data.value,
                },
                getReadingLog(data.value)
              );
              if (getReadingLog(data.value) === 2) {
                setFieldValue('group', 'all');
              } else {
                setFieldValue('group', '');
              }
            },
            placeholder: 'Select Program',
            disabled: values.badge_type === '',
          }}
          label="Programs"
        />
      ) : (
        <>
          <Label classes={{ labelStyle: classes.label }}>Programs</Label>
          <ReSelect
            selectProps={{
              options: renderProgramOption(),
              isMulti: true,
              value: values.program,
              closeMenuOnSelect: false,
              menuIsOpen: isOpen,
              name: 'program',
              inputId: 'program-input-id',
              onFocus: () => {
                setIsOpen(true);
              },
              onBlur: () => {
                setIsOpen(false);
                if (isChange && values.program && values.program.length > 0) {
                  handleGetLeaderboard(values);
                  setIsChange(false);
                }
              },
              className: classes.multipleSelect,
              isAllisSingle: true,
              onChange: programValues => {
                const lastVal = programValues[programValues.length - 1];
                setIsChange(true);
                if (!isEmpty(lastVal) && lastVal.value === 'all') {
                  setFieldValue('program', [lastVal]);
                  setIsOpen(false);
                  handleGetLeaderboard({
                    ...values,
                    program: [lastVal],
                  });
                  setIsChange(false);
                  document.getElementById('program-input-id').blur();
                } else {
                  setFieldValue(
                    'program',
                    programValues.length > 0
                      ? programValues.filter(v => v.value !== 'all')
                      : ''
                  );
                }
                if (
                  programValues.length === 0 ||
                  programValues.length < (values.program || []).length
                ) {
                  setFieldValue('group', '');
                }
              },
              placeholder: 'Select Programs',
            }}
          />
        </>
      )}
    </Grid.Column>
  );
};

export default ProgramSelect;
