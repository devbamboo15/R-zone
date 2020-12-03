import * as React from 'react';
import Modal, { BaseModalProps } from 'src/components/Modal';
import { Grid, Dropdown } from 'semantic-ui-react';
import { debounce } from 'lodash';
import BulkReaderSvg from 'src/assets/icons/bulk_reader.svg';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import Heading, { HeadingType } from 'src/components/Heading';
import Select from 'src/components/FormFields/Select';
import { IProgram } from 'src/store/types/organizer/program';
import { IOrganizerGroup, IReaderItem } from 'src/store/types/common';

export type AddReaderModalProps = IComponentProps & {
  programId: number | null;
  onChangeProgram: Function;
  groups: IOrganizerGroup[];
  onConfirmAddReader: Function;
  onCancelAddReader: Function;
  readers: IReaderItem[];
  onSelectReader: Function;
  onSearchReader: Function;
  readersLoading: boolean;
  addReaderLoading: boolean;
  groupId: string | number;
  readerId: string | number;
  setGroupId: Function;
  setReaderId: Function;
};
export type AddReaderModalOutProps = BaseModalProps & {
  programs?: IProgram[];
  onCancel: Function;
  onListReadersRefresh: Function;
  fromReadersPage?: boolean;
  groupIdFromReader?: string;
};
class AddReaderModal extends React.Component<
  AddReaderModalProps & AddReaderModalOutProps
> {
  handleChangeSearchReader = debounce((searchText: string) => {
    const { onSearchReader } = this.props;
    onSearchReader(searchText);
  }, 700);

  render() {
    const {
      modelProps,
      classes,
      programs = [],
      onChangeProgram,
      groups,
      onConfirmAddReader,
      onCancelAddReader,
      readers,
      readersLoading,
      groupId,
      readerId,
      programId,
      setGroupId,
      setReaderId,
      addReaderLoading,
      fromReadersPage,
    } = this.props;
    const programsOption = programs.map(item => ({
      value: item.id,
      text: item.attributes.name,
    }));
    const groupsOption = groups.map(item => ({
      value: item.id,
      text: item.attributes.name,
    }));
    const readersOption = readers.map(item => ({
      key: item.user_id,
      text: `${item.first_name} ${item.last_name}`,
      value: item.user_id,
    }));

    return (
      <Modal modelProps={{ ...modelProps }}>
        <div>
          <div className={classes.modalTop}>
            <BulkReaderSvg height={60} />
            <div style={{ marginTop: 10 }}>
              <Heading headingProps={{ as: 'h3' }} type={HeadingType.BOLD_600}>
                Move Reader
              </Heading>
            </div>
            <div className={classes.descriptionContainer}>
              <p>
                Use this function to quickly move a reader from one reading
                program or group to another reading program and group.
              </p>
              <p>
                To invite a new reader to participate in your reading programs,
                please use the "Invite Readers" function.
              </p>
            </div>
          </div>
          <Grid>
            <Grid.Column verticalAlign="bottom">
              <Dropdown
                fluid
                selection
                search
                options={readersOption}
                placeholder="Add Users"
                onChange={(_, { value }) => setReaderId(value)}
                onSearchChange={(_, { searchQuery }) => {
                  this.handleChangeSearchReader(searchQuery);
                }}
                disabled={readersLoading}
                loading={readersLoading}
              />
            </Grid.Column>
          </Grid>
          {!fromReadersPage && (
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
                    name: 'groupId',
                    placeholder: 'Mixed',
                    onChange: (_, { value }) => setGroupId(value),
                  }}
                />
              </Grid.Column>
            </Grid>
          )}

          <Grid>
            <Grid.Row textAlign="center" verticalAlign="middle">
              <div className={classes.bottomButtons}>
                <Button
                  colorVariant={ButtonColor.GRAY}
                  buttonType={ButtonType.ROUND}
                  buttonProps={{ onClick: () => onCancelAddReader() }}>
                  Cancel
                </Button>
                <Button
                  colorVariant={ButtonColor.PRIMARY}
                  buttonType={ButtonType.ROUND}
                  buttonProps={{
                    loading: addReaderLoading,
                    disabled: fromReadersPage
                      ? !readerId
                      : !readerId || !groupId || !programId,
                    onClick: () => onConfirmAddReader(),
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
export default AddReaderModal;
