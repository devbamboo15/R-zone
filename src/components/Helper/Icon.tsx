import * as React from 'react';
import { compose } from 'recompose';
import themr from 'src/helpers/themr';
import cx from 'classnames';
import { Popup } from 'semantic-ui-react';
import CircleQuestion from 'src/assets/icons/CircleQuestion.svg';
import styles from './styles.scss';

export type HelperIconProps = IComponentProps & {
  style?: any;
  className?: any;
  helperText?: string;
  content?: any;
  wide?: boolean;
  position?:
    | 'top center'
    | 'top left'
    | 'top right'
    | 'bottom right'
    | 'bottom left'
    | 'right center'
    | 'left center'
    | 'bottom center';
};

const renderIcon = (classes, content, className, style) => {
  return (
    <div
      className={cx(
        classes.helperIcon,
        !content ? classes.noContent : classes.hasContent,
        className
      )}
      style={style}>
      <span>{content || <CircleQuestion />}</span>
    </div>
  );
};

const HelperIcon = ({
  classes,
  style,
  className,
  helperText,
  position,
  content,
  wide = false,
}: HelperIconProps) =>
  helperText ? (
    <Popup
      wide={wide}
      position={position || 'top center'}
      content={helperText}
      trigger={renderIcon(classes, content, className, style)}
    />
  ) : (
    renderIcon(classes, content, className, style)
  );

export default compose<HelperIconProps, HelperIconProps>(
  themr<HelperIconProps>('HelperIcon', styles)
)(HelperIcon);
