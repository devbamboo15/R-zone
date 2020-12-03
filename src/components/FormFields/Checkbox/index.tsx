import * as React from 'react';
import themr from 'src/helpers/themr';
import cx from 'classnames';
import {
  CheckboxProps as BaseCheckboxProps,
  Checkbox as BaseCheckbox,
} from 'semantic-ui-react';
import styles from './styles.scss';

export type CheckboxProps = IComponentProps & {
  checkboxProps?: BaseCheckboxProps;
  secondary?: boolean;
  primary?: boolean;
  center?: boolean;
  errorMessage?: string;
};

class Checkbox extends React.Component<CheckboxProps, {}> {
  static defaultProps = {
    checkboxProps: {
      toggle: false,
    },
    primary: true,
    center: false,
    errorMessage: '',
  };

  render() {
    const {
      classes,
      children,
      checkboxProps,
      secondary,
      primary,
      center,
      errorMessage,
    } = this.props;
    return (
      <div
        className={cx(classes.wrapper, {
          [classes.center]: center,
        })}>
        <div className={classes.checkboxContainer}>
          <BaseCheckbox
            toggle={checkboxProps.toggle}
            className={cx(
              styles.checkboxStyle,
              {
                [classes.secondaryCheckbox]: secondary,
                [classes.primaryCheckbox]: primary,
                toggle_checkbox: checkboxProps.toggle,
                [classes.simple_checkbox]: !checkboxProps.toggle,
              },
              checkboxProps.customclass
            )}
            {...checkboxProps}
          />
          {children && <div className={classes.checkboxText}>{children}</div>}
        </div>
        <div className={classes.errorMessage}>{errorMessage}</div>
      </div>
    );
  }
}

export default themr<CheckboxProps>('Checkbox', styles)(Checkbox);
