import * as React from 'react';
import Modal, { BaseModalProps } from 'src/components/Modal';
import { Grid } from 'semantic-ui-react';
import { size, get } from 'lodash';
import cn from 'classnames';
import PlusButtonSvg from 'src/assets/icons/plus.svg';
// import HelpSvg from 'src/assets/icons/help.svg';
import BulkReaderSvg from 'src/assets/icons/bulk_reader.svg';
import RightArrowSvg from 'src/assets/icons/right_arrow.svg';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import Heading, { HeadingColor, HeadingType } from 'src/components/Heading';
import Select from 'src/components/FormFields/Select';
import { IProgram } from 'src/store/types/organizer/program';
import { IOrganizerGroup } from 'src/store/types/common';
import { IGroupItem } from 'src/store/types';

export type BulkManageReaderProps = IComponentProps & {
  programId: number | string;
  groupId: number | string;
  onChangeProgram: Function;
  groups: IOrganizerGroup[];
  onConfirmAddReaders: Function;
  onConfirmMoveReaders: Function;
  setGroupId: Function;
  addReadersLoading: boolean;
  moveReadersLoading: boolean;
  program: IProgram | null;
  group: IGroupItem | null;
};
export type BulkManageReaderOutProps = BaseModalProps & {
  programs: IProgram[];
  onCancel: Function;
  type: any;
  onAddReaders: Function;
  onMoveReaders: Function;
  selectedIds: Record<string, any>;
  onListReadersRefresh: Function;
};
const BulkManageReaderModal = ({
  modelProps,
  classes,
  onCancel,
  onAddReaders,
  onMoveReaders,
  type,
  programs,
  onChangeProgram,
  groups,
  selectedIds,
  onConfirmAddReaders,
  onConfirmMoveReaders,
  setGroupId,
  groupId,
  programId,
  addReadersLoading,
  moveReadersLoading,
  program,
  group,
}: BulkManageReaderProps & BulkManageReaderOutProps) => {
  const programsOption = programs.map(item => ({
    value: item.id,
    text: item.attributes.name,
  }));
  const groupsOption = groups.map(item => ({
    value: item.id,
    text: item.attributes.name,
  }));
  const countSelected = size(selectedIds);
  return (
    <Modal modelProps={{ ...modelProps }}>
      <div>
        <div className={classes.modalTop}>
          <BulkReaderSvg height={60} />
          <div style={{ marginTop: 10 }}>
            <Heading headingProps={{ as: 'h3' }} type={HeadingType.BOLD_600}>
              Bulk Manage Selected Readers
              <span className={classes.count}>({countSelected})</span>
            </Heading>
          </div>
        </div>
        <Grid columns={2}>
          <Select
            selectProps={{
              options: programsOption,
              placeholder: 'Select Program',
              name: 'programId',
              onChange: (_, data) => onChangeProgram(data),
            }}
            label="Select the target Program or Group"
          />
          <Grid.Column verticalAlign="bottom">
            <Select
              selectProps={{
                options: groupsOption,
                placeholder: 'Mixed',
                name: 'groupId',
                onChange: (_, { value }) => setGroupId(value),
              }}
            />
          </Grid.Column>
        </Grid>
        {type === 'add' && (
          <Grid
            className={cn(
              classes.messageContainer,
              classes.messageCautionContainer
            )}>
            <Grid.Row
              textAlign="center"
              verticalAlign="middle"
              className={classes.messageIcon}>
              <div className={classes.cautionIcon}>!</div>
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
                You are about to Add {countSelected} Readers to:
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
                {get(program, 'attributes.name')} {group ? '-' : ''}
                {get(group, 'attributes.name')}
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

        {type === 'move' && (
          <Grid
            className={cn(
              classes.messageContainer,
              classes.messageWarningContainer
            )}>
            <Grid.Row
              textAlign="center"
              verticalAlign="middle"
              className={classes.messageIcon}>
              <div className={classes.warningIcon}>!</div>
              <Heading
                headingProps={{ as: 'h4' }}
                colorVariant={HeadingColor.WARNING}>
                Warning
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
                You are about to Re-Assign {countSelected} Readers to:
              </Heading>
            </Grid.Row>
            <Grid.Row
              textAlign="center"
              verticalAlign="middle"
              className={classes.messageIcon}>
              <Heading
                headingProps={{ as: 'h3' }}
                colorVariant={HeadingColor.WARNING}
                type={HeadingType.BOLD_500}>
                {get(program, 'attributes.name')} {group ? '-' : ''}
                {get(group, 'attributes.name')}
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
                This will REMOVE all Readers from their current Programs and
                Groups, and place them in the Program/Group selected above. THIS
                CANNOT BE UNDONE.
              </Heading>
            </Grid.Row>
          </Grid>
        )}

        <Grid>
          <Grid.Row textAlign="center" verticalAlign="middle">
            <div className={classes.bottomButtons}>
              <Button
                colorVariant={ButtonColor.GRAY}
                buttonType={ButtonType.ROUND}
                buttonProps={{ onClick: () => onCancel() }}>
                Cancel
              </Button>
              {!type && (
                <div className={classes.modalButtons}>
                  {/* <div className={classes.modelWhatText}>
                    <HelpSvg height={16} />
                    <Heading
                      headingProps={{ as: 'h5' }}
                      type={HeadingType.BOLD_500}
                      colorVariant={HeadingColor.CYAN}>
                      What's this?
                    </Heading>
                  </div> */}
                  <Button
                    icon={<PlusButtonSvg height={16} />}
                    colorVariant={ButtonColor.MAIN}
                    buttonType={ButtonType.ROUND}
                    buttonProps={{
                      disabled: !groupId || !programId,
                      onClick: () => onAddReaders(),
                    }}>
                    Add Readers
                  </Button>
                  <Button
                    icon={<RightArrowSvg height={16} />}
                    colorVariant={ButtonColor.SECONDARY}
                    buttonType={ButtonType.ROUND}
                    buttonProps={{
                      disabled: !groupId || !programId,
                      onClick: () => onMoveReaders(),
                    }}>
                    Move Readers
                  </Button>
                </div>
              )}
              {type === 'add' && (
                <Button
                  colorVariant={ButtonColor.PRIMARY}
                  buttonType={ButtonType.ROUND}
                  buttonProps={{
                    loading: addReadersLoading,
                    disabled: !groupId || !programId,
                    onClick: () => onConfirmAddReaders(),
                  }}>
                  Confirm
                </Button>
              )}
              {type === 'move' && (
                <Button
                  colorVariant={ButtonColor.PRIMARY}
                  buttonType={ButtonType.ROUND}
                  buttonProps={{
                    loading: moveReadersLoading,
                    disabled: !groupId || !programId,
                    onClick: () => onConfirmMoveReaders(),
                  }}>
                  Confirm
                </Button>
              )}
            </div>
          </Grid.Row>
        </Grid>
      </div>
    </Modal>
  );
};
export default BulkManageReaderModal;
