import * as React from 'react';
import themr from 'src/helpers/themr';
import cx from 'classnames';
import {
  FormField,
  SelectProps,
  Select as BaseSelect,
  GridColumn,
} from 'semantic-ui-react';
import Label from 'src/components/FormFields/Label';
import styles from './styles.scss';

export type BaseSelectProps = IComponentProps & {
  selectProps: SelectProps;
  errorMessage?: any;
  label?: string;
  highlight?: boolean;
  errorMessageOverlap?: boolean;
};

class Select extends React.Component<BaseSelectProps, {}> {
  render() {
    const {
      classes,
      selectProps,
      errorMessage,
      label,
      highlight,
      errorMessageOverlap,
    } = this.props;
    return (
      <>
        <GridColumn>
          <FormField
            className={cx(
              classes.column,
              !!errorMessage && highlight
                ? classes.errorField
                : classes.validField,
              errorMessageOverlap
                ? classes.errorMessageOverlap
                : classes.errorMessageStatic
            )}>
            {label && (
              <Label classes={{ labelStyle: classes.label }}>{label}</Label>
            )}
            <BaseSelect {...selectProps} />
            {errorMessage && (
              <div className={classes.errorMessage}>{errorMessage}</div>
            )}
          </FormField>
        </GridColumn>
      </>
    );
  }
}

export default themr<BaseSelectProps>('Select', styles)(Select);
