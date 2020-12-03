import * as React from 'react';
import Modal from 'src/components/Modal';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import { Grid } from 'semantic-ui-react';
import Badge, { BadgeSize } from 'src/components/Badge';

export type Props = IComponentProps & { ref: Function; customContent?: any };

export interface IState {
  program: any;
  share: any;
  isOpen?: boolean;
}

class BadgePreviewModal extends React.Component<Props, IState> {
  state = {
    program: null,
    isOpen: false,
    share: null,
  };

  open = (options: IState) => {
    this.setState({ ...options, isOpen: true });
  };

  close = () => {
    this.setState({ isOpen: false });
  };

  render() {
    const { customContent } = this.props;
    const { isOpen, program, share } = this.state;

    return (
      <Modal modelProps={{ open: isOpen, closeIcon: false, size: 'small' }}>
        <Grid.Column mobile={16} computer={5}>
          <Badge
            badgeSize={BadgeSize.X_LAGER}
            program={program}
            share={share}
            customContent={customContent}
          />
        </Grid.Column>

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
                  this.close();
                },
              }}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default BadgePreviewModal;
