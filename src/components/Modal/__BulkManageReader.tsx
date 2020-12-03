import * as React from 'react';
import Modal, { BaseModalProps } from 'src/components/Modal';
import themr from 'src/helpers/themr';
import { Grid } from 'semantic-ui-react';
import PlusButtonSvg from 'src/assets/icons/plus.svg';
import BulkReaderSvg from 'src/assets/icons/bulk_reader.svg';
import RightArrowSvg from 'src/assets/icons/right_arrow.svg';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import Heading, { HeadingColor, HeadingType } from 'src/components/Heading';
import Select from 'src/components/FormFields/Select';
import styles from './styles.scss';

export type BulkManageReaderProps = IComponentProps &
  BaseModalProps & {
    onCancel: Function;
    type: any;
    onAddClick: Function;
  };

const BulkManageReaderModal = ({
  modelProps,
  classes,
  onCancel,
  onAddClick,
  type,
}: BulkManageReaderProps) => (
  <Modal modelProps={{ ...modelProps }}>
    <div>
      <div className={classes.modalTop}>
        <BulkReaderSvg height={40} />
        <div style={{ marginTop: 10 }}>
          <Heading headingProps={{ as: 'h3' }} type={HeadingType.BOLD_600}>
            Bulk Manage Selected Readers
          </Heading>
        </div>
      </div>
      <Grid columns={2}>
        <Select
          selectProps={{
            options: [
              {
                text: 's',
                value: 's',
              },
            ],
            placeholder: 'Select Program',
            name: 'type',
          }}
          label="Select the target Program or Group"
        />
        <Grid.Column verticalAlign="bottom">
          <Select
            selectProps={{
              options: [
                {
                  text: 's',
                  value: 's',
                },
              ],
              placeholder: 'Mixed',
              name: 'mixed',
            }}
          />
        </Grid.Column>
      </Grid>
      {type === 'add' && (
        <Grid className={classes.messageContainer}>
          <Grid.Row
            textAlign="center"
            verticalAlign="middle"
            className={classes.messageIcon}>
            <div className={classes.warningIcon}>!</div>
            <Heading
              headingProps={{ as: 'h4' }}
              colorVariant={HeadingColor.YELLOW}>
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
              You are about to Add 10 Readers to
            </Heading>
          </Grid.Row>
          <Grid.Row
            textAlign="center"
            verticalAlign="middle"
            className={classes.messageIcon}>
            <Heading
              headingProps={{ as: 'h3' }}
              colorVariant={HeadingColor.YELLOW}
              type={HeadingType.BOLD_500}>
              Program Name - Group Name
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
              This will add this Program/Group to all of the above Reader’s
              accounts, along with any others they have already joined.
            </Heading>
          </Grid.Row>
        </Grid>
      )}

      <Grid>
        <Grid.Row textAlign="center" verticalAlign="middle">
          <Button
            colorVariant={ButtonColor.GRAY}
            buttonType={ButtonType.ROUND}
            buttonProps={{ onClick: () => onCancel() }}>
            Cancel
          </Button>
          {type !== 'add' && (
            <div className={classes.modalButtons}>
              <div className={classes.modelWhatText}>
                <Heading
                  headingProps={{ as: 'h5' }}
                  type={HeadingType.BOLD_600}
                  colorVariant={HeadingColor.CYAN}>
                  What's this?
                </Heading>
              </div>
              <Button
                icon={<PlusButtonSvg height={16} />}
                colorVariant={ButtonColor.MAIN}
                buttonType={ButtonType.ROUND}
                buttonProps={{ onClick: () => onAddClick() }}>
                Add Readers
              </Button>
              <Button
                icon={<RightArrowSvg height={16} />}
                colorVariant={ButtonColor.SECONDARY}
                buttonType={ButtonType.ROUND}>
                Move Readers
              </Button>
            </div>
          )}
          {type === 'add' && (
            <Button
              colorVariant={ButtonColor.PRIMARY}
              buttonType={ButtonType.ROUND}
              buttonProps={{ onClick: () => onCancel() }}>
              Confirm
            </Button>
          )}
        </Grid.Row>
      </Grid>
    </div>
  </Modal>
);

export default themr<BulkManageReaderProps>('BulkManageReaderModal', styles)(
  BulkManageReaderModal
);
