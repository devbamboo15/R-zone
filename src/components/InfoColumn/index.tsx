import * as React from 'react';
import themr from 'src/helpers/themr';
import cx from 'classnames';
import {
  FormField,
  GridColumn,
  GridColumnProps,
  Popup,
} from 'semantic-ui-react';
import Label from 'src/components/FormFields/Label';
import CopyIcon from 'src/assets/icons/Copy.svg';
import HelperIcon from 'src/components/Helper/Icon';
import styles from './styles.scss';

export type BaseInfoColumnProps = IComponentProps & {
  label?: string;
  fallbackMessage?: any;
  value?: string;
  columnProps?: GridColumnProps;
  labelNote?: boolean;
  copyIcon?: boolean;
  copyIconTitle?: string;
  onCopyClick?: Function;
  labelNoteText?: string;
  highlight?: boolean;
  errorMessageOverlap?: boolean;
  fallbackNoRender?: boolean;
};

class InfoColumn extends React.Component<BaseInfoColumnProps, {}> {
  static defaultProps = {
    fallbackMessage: 'No Information Provided',
    fallbackNoRender: false,
  };

  render() {
    const {
      classes,
      fallbackMessage,
      label,
      columnProps,
      labelNote,
      copyIcon,
      copyIconTitle,
      onCopyClick,
      labelNoteText,
      errorMessageOverlap,
      value,
      fallbackNoRender,
    } = this.props;
    const shouldShowFallback = !(value && value.length > 0);
    if (shouldShowFallback && fallbackNoRender) {
      return null;
    }
    return (
      <>
        <GridColumn {...columnProps}>
          <FormField
            className={cx(
              classes.column,
              classes.validField,
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
            <div
              className={
                shouldShowFallback ? classes.disabled : classes.infoText
              }>
              {shouldShowFallback ? fallbackMessage : value}
            </div>
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
          </FormField>
        </GridColumn>
      </>
    );
  }
}

export default themr<BaseInfoColumnProps>('InfoColumn', styles)(InfoColumn);
