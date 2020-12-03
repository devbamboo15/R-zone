import * as React from 'react';
import Modal, { BaseModalProps } from 'src/components/Modal';
import { Grid, List } from 'semantic-ui-react';
import BulkDeleteReaderIcon from 'src/assets/icons/bulk-delete-reader.svg';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import Heading, { HeadingType, HeadingColor } from 'src/components/Heading';
import { IProgram } from 'src/store/types/organizer/program';

export type BulkDeleteReaderModalProps = IComponentProps & {
  onConfirmDeleteReader: Function;
};
export type BulkDeleteReaderModalOutProps = BaseModalProps & {
  programs?: IProgram[];
  onCancel: Function;
  onListReadersRefresh: Function;
  deleteBulkReaderLoading?: boolean;
  selectedReaders: Record<string, any>;
};
class BulkDeleteReaderModal extends React.Component<
  BulkDeleteReaderModalProps & BulkDeleteReaderModalOutProps
> {
  renderTitle() {
    const { selectedReaders, classes } = this.props;
    if (selectedReaders.length > 1) {
      return (
        <Heading headingProps={{ as: 'h3' }} type={HeadingType.BOLD_600}>
          Bulk Delete Selected Readers
          <span className={classes.count}>({selectedReaders.length})</span>
        </Heading>
      );
    }

    return (
      <Heading headingProps={{ as: 'h3' }} type={HeadingType.BOLD_600}>
        Delete Selected Reader
      </Heading>
    );
  }

  render() {
    const {
      modelProps,
      classes,
      onCancel,
      onConfirmDeleteReader,
      deleteBulkReaderLoading,
      selectedReaders,
    } = this.props;

    return (
      <Modal modelProps={{ ...modelProps }}>
        <div>
          <div className={classes.modalTop}>
            <BulkDeleteReaderIcon height={60} />
            <div style={{ marginTop: 10 }}>{this.renderTitle()}</div>
          </div>
          <Grid className={classes.messageCautionDangerContainer}>
            <Grid.Row
              textAlign="center"
              verticalAlign="middle"
              className={classes.messageIcon}>
              <div className={classes.cautionDangerIcon}>!</div>
              <Heading
                headingProps={{ as: 'h4' }}
                colorVariant={HeadingColor.DANGER}>
                Caution
              </Heading>
            </Grid.Row>
            <Grid.Row
              textAlign="center"
              verticalAlign="middle"
              className={classes.messageIcon}>
              <Heading
                headingProps={{ as: 'h4' }}
                colorVariant={HeadingColor.GRAY}
                type={HeadingType.BOLD_500}>
                You are about to delete the following reader
                {`${selectedReaders.length > 1 ? 's' : ''}`}:
              </Heading>
            </Grid.Row>
            <Grid.Row>
              {selectedReaders.length > 0 && (
                <List bulleted>
                  {selectedReaders.map((item, index) => {
                    return (
                      <List.Item className={classes.readerItems} key={index}>
                        {`${item.first_name} ${item.last_name}`}
                      </List.Item>
                    );
                  })}
                </List>
              )}
            </Grid.Row>
            <Grid.Row
              textAlign="center"
              verticalAlign="middle"
              className={classes.messageIcon}>
              <Heading
                headingProps={{ as: 'h4' }}
                colorVariant={HeadingColor.GRAY}
                type={HeadingType.BOLD_500}>
                This action will <strong>DELETE</strong> the reader and all
                their reading data from Reader Zone.{' '}
                <strong>THIS ACTION CANNOT BE UNDONE</strong>
              </Heading>
            </Grid.Row>
          </Grid>
          <Grid>
            <Grid.Row textAlign="center" verticalAlign="middle">
              <div className={classes.bottomButtons}>
                <Button
                  colorVariant={ButtonColor.GRAY}
                  buttonType={ButtonType.ROUND}
                  buttonProps={{ onClick: () => onCancel() }}>
                  Cancel
                </Button>
                <Button
                  colorVariant={ButtonColor.PRIMARY}
                  buttonType={ButtonType.ROUND}
                  buttonProps={{
                    loading: deleteBulkReaderLoading,
                    onClick: () => onConfirmDeleteReader(),
                  }}>
                  Confirm
                </Button>
              </div>
            </Grid.Row>
          </Grid>
        </div>
      </Modal>
    );
  }
}
export default BulkDeleteReaderModal;
