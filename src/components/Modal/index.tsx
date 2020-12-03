import * as React from 'react';
import themr from 'src/helpers/themr';
import {
  Modal as BaseModal,
  ModalProps,
  ModalContentProps,
} from 'semantic-ui-react';
import styles from './styles.scss';

export type BaseModalProps = IComponentProps & {
  modelProps?: ModalProps;
  contentProps?: ModalContentProps;
  header?: React.ReactNode;
};

class Modal extends React.Component<BaseModalProps, {}> {
  static defaultProps = {
    modelProps: {},
  };

  render() {
    const { children, modelProps, contentProps, header } = this.props;
    return (
      <BaseModal {...modelProps}>
        {header && <BaseModal.Header>{header}</BaseModal.Header>}
        <BaseModal.Content {...contentProps}>{children}</BaseModal.Content>
      </BaseModal>
    );
  }
}

export default themr<BaseModalProps>('Modal', styles)(Modal);
