import * as React from 'react';
import { Icon } from 'semantic-ui-react';
import cx from 'classnames';

export enum MessageBoxVariant {
  INFO,
  WARNING,
}

export type Props = IComponentProps & {
  variant?: MessageBoxVariant;
  description: string | React.ReactElement;
};

class MessageBox extends React.Component<Props> {
  static defaultProps = {
    variant: MessageBoxVariant.INFO,
  };

  getIcon() {
    const { variant } = this.props;
    if (variant === MessageBoxVariant.WARNING) {
      return 'exclamation';
    }
    if (variant === MessageBoxVariant.INFO) {
      return 'lightbulb';
    }
    return null;
  }

  getTitle() {
    const { variant } = this.props;
    if (variant === MessageBoxVariant.WARNING) {
      return 'Caution';
    }
    if (variant === MessageBoxVariant.INFO) {
      return 'Tip';
    }
    return null;
  }

  render() {
    const { classes, variant, description } = this.props;
    return (
      <div
        className={cx(classes.wrapper, {
          [classes.warningWrapper]: variant === MessageBoxVariant.WARNING,
          [classes.infoWrapper]: variant === MessageBoxVariant.INFO,
        })}>
        <div
          className={cx(classes.title, {
            [classes.warningTitle]: variant === MessageBoxVariant.WARNING,
            [classes.infoTitle]: variant === MessageBoxVariant.INFO,
          })}>
          <div
            className={cx(classes.titleIcon, {
              [classes.warningTitleIcon]: variant === MessageBoxVariant.WARNING,
              [classes.infoTitleIcon]: variant === MessageBoxVariant.INFO,
            })}>
            <Icon name={this.getIcon()} size="large" />
          </div>
          {this.getTitle()}
        </div>
        <div className={classes.description}>{description}</div>
      </div>
    );
  }
}

export default MessageBox;
