import * as React from 'react';
import Modal from 'src/components/Modal';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';

export type Props = IComponentProps & { ref: Function };

export interface IState {
  message: string;
  okButtonText?: string;
  cancelButtonText?: string;
  onOkClick?: Function;
  onCancelClick?: Function;
  isOpen?: boolean;
}

class ConfirmationModal extends React.Component<Props, IState> {
  state = {
    message: '',
    okButtonText: 'Yes',
    cancelButtonText: 'No',
    onOkClick: () => {},
    onCancelClick: () => {},
    isOpen: false,
  };

  open = (options: IState) => {
    this.setState({ ...options, isOpen: true });
  };

  close = () => {
    this.setState({ isOpen: false });
  };

  render() {
    const {
      isOpen,
      message,
      onOkClick,
      onCancelClick,
      okButtonText,
      cancelButtonText,
    } = this.state;
    // TODO: Used inline styles here for now , as we are using `ref` prop here and themr doesn't support ref for now
    return (
      <Modal modelProps={{ open: isOpen, closeIcon: false, size: 'small' }}>
        <div
          style={{
            textAlign: 'center',
            fontSize: '20px',
            whiteSpace: 'pre-line',
          }}>
          {message}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '20px',
          }}>
          <div style={{ marginRight: 10 }}>
            <Button
              colorVariant={ButtonColor.PRIMARY}
              buttonType={ButtonType.ROUND}
              buttonProps={{
                onClick: () => {
                  onOkClick();
                  this.close();
                },
              }}>
              {okButtonText}
            </Button>
          </div>
          <div>
            <Button
              colorVariant={ButtonColor.DANGER}
              buttonType={ButtonType.ROUND}
              buttonProps={{
                onClick: () => {
                  onCancelClick();
                  this.close();
                },
              }}>
              {cancelButtonText}
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default ConfirmationModal;
