import React from 'react';
import { Prompt } from 'react-router-dom';
import AlertModal from 'src/components/Modal/AlertModal';

export interface ComponentProps {
  when?: any;
  navigate?: any;
  onCancel?: any;
  message?: any;
  shouldBlockNavigation?: any;
}
export type RouteLeavingGuardProps = ComponentProps;
export class RouteLeavingGuard extends React.Component<RouteLeavingGuardProps> {
  state = {
    modalVisible: false,
    lastLocation: null,
    confirmedNavigation: false,
  };

  showModal = location => {
    this.setState({
      modalVisible: true,
      lastLocation: location,
    });
  };

  closeModal = callback => {
    const { lastLocation } = this.state;
    this.setState({ modalVisible: false }, () => {
      if (callback && typeof callback === 'function') callback(lastLocation);
    });
  };

  handleBlockedNavigation = nextLocation => {
    const { confirmedNavigation } = this.state;
    const { shouldBlockNavigation } = this.props;
    if (!confirmedNavigation && shouldBlockNavigation(nextLocation)) {
      this.showModal(nextLocation);
      return false;
    }
    return true;
  };

  handleConfirmNavigationClick = () => {
    this.closeModal(() => {
      const { navigate } = this.props;
      const { lastLocation } = this.state;
      if (lastLocation) {
        this.setState({ confirmedNavigation: true }, () => {
          // Navigate to the previous blocked location with your navigate function
          navigate(lastLocation.pathname);
        });
      }
    });
  };

  render() {
    const { when, message, onCancel } = this.props;
    const { modalVisible } = this.state;
    return (
      <>
        <Prompt when={when} message={this.handleBlockedNavigation} />
        <AlertModal
          modelProps={{
            open: modalVisible,
            centered: false,
            dimmer: 'inverted',
            onClose: () => {
              this.closeModal(onCancel);
            },
          }}
          onCancel={() => {
            this.closeModal(onCancel);
          }}
          onSave={this.handleConfirmNavigationClick}
          text={message}
          saveTxt="Yes"
          discardTxt="No"
        />
      </>
    );
  }
}
export default RouteLeavingGuard;
