import * as React from 'react';
import themr from 'src/helpers/themr';
import cx from 'classnames';
import {
  FormField,
  InputProps,
  Input as BaseInput,
  GridColumn,
  GridColumnProps,
  Popup,
} from 'semantic-ui-react';
import Label from 'src/components/FormFields/Label';
import CopyIcon from 'src/assets/icons/Copy.svg';
import HelperIcon from 'src/components/Helper/Icon';
import styles from './styles.scss';

export type BaseInputProps = IComponentProps & {
  inputProps?: InputProps;
  errorMessage?: any;
  label?: string;
  columnProps?: GridColumnProps;
  labelNote?: boolean;
  copyIcon?: boolean;
  copyIconTitle?: string;
  onCopyClick?: Function;
  labelNoteText?: string;
  highlight?: boolean;
  errorMessageOverlap?: boolean;
};

class Input extends React.Component<BaseInputProps, {}> {
  render() {
    const {
      classes,
      inputProps,
      errorMessage,
      label,
      columnProps,
      labelNote,
      copyIcon,
      copyIconTitle,
      onCopyClick,
      labelNoteText,
      highlight,
      errorMessageOverlap,
    } = this.props;
    return (
      <>
        <GridColumn {...columnProps}>
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
              <Label
                classes={{
                  labelStyle: cx(classes.label, classes.noteWrapper),
                }}>
                {label}
                {labelNote && (
                  <HelperIcon
                    style={{
                      marginLeft: '10px',
                      position: 'relative',
                      top: '2px',
                    }}
                    helperText={labelNoteText}
                  />
                )}
              </Label>
            )}
            <BaseInput {...inputProps} />
            {copyIcon && (
              <Popup
                className={classes.copyPopup}
                content={copyIconTitle}
                trigger={
                  <CopyIcon
                    height={35}
                    className={classes.copyIcon}
                    onClick={onCopyClick}
                  />
                }
              />
            )}
            {errorMessage && (
              <div className={classes.errorMessage}>{errorMessage}</div>
            )}
          </FormField>
        </GridColumn>
      </>
    );
  }
}

export default themr<BaseInputProps>('Input', styles)(Input);
