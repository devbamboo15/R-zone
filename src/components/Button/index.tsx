import * as React from 'react';
import themr from 'src/helpers/themr';
import cn from 'classnames';
import {
  Button as BaseButton,
  ButtonProps as BaseButtonProps,
} from 'semantic-ui-react';
import styles from './styles.scss';

export enum ButtonColor {
  SECONDARY = 'secondary',
  PRIMARY = 'primary',
  PRIMARY_COLOR = 'primary_color',
  MAIN = 'main',
  DANGER = 'danger',
  RED = 'red',
  YELLOW = 'yellow',
  WHITE = 'white',
  CYAN = 'cyan',
  GRAY = 'gray',
  DANGER_FADE = 'danger_fade',
  SUCCESS_FADE = 'success_fade',
  NO_COLOR = 'no_color',
}

export enum ButtonType {
  TRANSPARENT = 'transparent',
  ROUND = 'round',
  ROUND_OUTLINED = 'round_outlined',
}

export enum ButtonWeight {
  NORMAL = 'normal',
  _500 = '_500',
  _600 = '_600',
  BOLD = 'bold',
}

export type ButtonProps = IComponentProps & {
  colorVariant?: ButtonColor;
  buttonType?: ButtonType;
  buttonWeight?: ButtonWeight;
  icon?: any;
  numberText?: number;
  buttonProps?: BaseButtonProps;
  btnClass?: any;
};

class Button extends React.Component<ButtonProps, {}> {
  render() {
    const {
      classes,
      children,
      buttonProps,
      icon,
      colorVariant,
      buttonType,
      numberText,
      btnClass,
      buttonWeight,
    } = this.props;
    const outlined = buttonType === ButtonType.ROUND_OUTLINED;
    const primary = !outlined;
    return (
      <div className={classes.button}>
        <BaseButton
          primary={primary}
          className={cn(
            classes.button,
            {
              [classes.round_button]:
                buttonType === ButtonType.ROUND ||
                buttonType === ButtonType.ROUND_OUTLINED,
              [classes.outlined_button]: outlined,
              [classes.transparent_button]:
                buttonType === ButtonType.TRANSPARENT,
              [classes.red_text]: colorVariant === ButtonColor.RED,
              [classes.primary_button]: colorVariant === ButtonColor.PRIMARY,
              [classes.secondary_button]:
                colorVariant === ButtonColor.SECONDARY && !outlined,
              [classes.secondary_outlined_button]:
                colorVariant === ButtonColor.SECONDARY && outlined,
              [classes.white_button]: colorVariant === ButtonColor.WHITE,
              [classes.main_button]: colorVariant === ButtonColor.MAIN,
              [classes.danger_button]: colorVariant === ButtonColor.DANGER,
              [classes.yellow_button]: colorVariant === ButtonColor.YELLOW,
              [classes.gray_button]: colorVariant === ButtonColor.GRAY,
              [classes.cyan_button]: colorVariant === ButtonColor.CYAN,
              [classes.danger_fade]: colorVariant === ButtonColor.DANGER_FADE,
              [classes.success_fade]: colorVariant === ButtonColor.SUCCESS_FADE,
              [classes.gray_button]: colorVariant === ButtonColor.GRAY,
              [classes.primary_color_button]:
                colorVariant === ButtonColor.PRIMARY_COLOR,
              [classes.noColorButton]: colorVariant === ButtonColor.NO_COLOR,
              [classes.iconButton]: icon,
              [classes.numberButton]: numberText || numberText === 0,
              [classes.weightNormal]: buttonWeight === ButtonWeight.NORMAL,
              [classes.weight500]: buttonWeight === ButtonWeight._500,
              [classes.weight600]: buttonWeight === ButtonWeight._600,
              [classes.weightBold]: buttonWeight === ButtonWeight.BOLD,
            },
            btnClass
          )}
          {...buttonProps}>
          {icon && <div className={classes.iconContainer}>{icon}</div>}
          {(numberText || numberText === 0) && (
            <div className={classes.numberContainer}>{numberText}</div>
          )}

          {children}
        </BaseButton>
      </div>
    );
  }
}

export default themr<ButtonProps>('Button', styles)(Button);
