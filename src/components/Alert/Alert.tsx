import * as React from 'react';
import { Message, MessageProps } from 'semantic-ui-react';
import cn from 'classnames';

export enum AlertType {
  SUCCESS = 'success',
  WARNING = 'warning',
  DANGER = 'danger',
}
export enum AlertPosition {
  BOTTOM_FIXED = 'bottom_fixed',
  TOP_FIXED = 'top_fixed',
}

export type AlertProps = IComponentProps &
  MessageProps & {
    header?: string;
    Icon?: any;
    iconStyle?: any;
    content: string;
    alertType: AlertType;
    alertPosition: AlertPosition;
    autoDismiss?: number | null;
  };

export interface AlertState {
  isDismiss: boolean;
}

class Alert extends React.Component<AlertProps, AlertState> {
  state = {
    isDismiss: false,
  };

  static defaultProps = {
    content: '',
    autoDismiss: null,
  };

  _isMounted = false;

  timeout = null;

  componentDidMount() {
    this._isMounted = true;
    const { autoDismiss } = this.props;
    if (autoDismiss) {
      this.timeout = setTimeout(() => {
        if (this._isMounted) {
          this.setState({ isDismiss: true });
        }
      }, Number(autoDismiss) * 1000);
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  render() {
    const {
      classes,
      header,
      content,
      Icon,
      alertType,
      alertPosition,
      iconStyle,
    } = this.props;
    const { isDismiss } = this.state;
    return (
      <div>
        <Message
          hidden={isDismiss}
          positive
          className={cn(classes.container, {
            [classes.messageSuccess]: alertType === AlertType.SUCCESS,
            [classes.messageWarning]: alertType === AlertType.WARNING,
            [classes.messageDanger]: alertType === AlertType.DANGER,
            [classes.messageBottomFixed]:
              alertPosition === AlertPosition.BOTTOM_FIXED,
            [classes.messageTopFixed]:
              alertPosition === AlertPosition.TOP_FIXED,
          })}>
          {header && <Message.Header>{header}</Message.Header>}
          {Icon && <Icon style={iconStyle} />}
          <Message.Content className={classes.content}>
            {content}
          </Message.Content>
        </Message>
      </div>
    );
  }
}
export default Alert;
