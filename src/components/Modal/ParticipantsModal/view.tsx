import * as React from 'react';
import Modal, { BaseModalProps } from 'src/components/Modal';
import { TableRow, Table, TableCell, Grid } from 'semantic-ui-react';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import Heading, { HeadingType, HeadingColor } from 'src/components/Heading';
import Checkbox from 'src/components/FormFields/Checkbox';
import { map, filter, size, forEach, pickBy, keys, includes } from 'lodash';
import cx from 'classnames';
import { isFunction } from 'util';

export type ParticipantsModalProps = IComponentProps & {
  onSave: Function;
};
export type ParticipantsModalOutProps = BaseModalProps & {
  onCancel?: Function;
  participants: any[];
  allParticipants: any[];
  onSelected: Function;
};
interface ParticipantsModalState {
  selectedItems: Record<string, any>;
  isSelectedAll: boolean;
}
class ParticipantsModal extends React.Component<
  ParticipantsModalProps & ParticipantsModalOutProps,
  ParticipantsModalState
> {
  state = {
    selectedItems: {},
    isSelectedAll: false,
  };

  componentWillReceiveProps(nextProps: any) {
    if (size(nextProps.allParticipants) !== size(this.props.allParticipants)) {
      const { allParticipants } = nextProps;
      const { selectedItems } = this.state;
      forEach(allParticipants, (user: any) => {
        selectedItems[user.user_id] = true;
      });

      this.setState({
        selectedItems,
        isSelectedAll: true,
      });
    }
    if (size(nextProps.participants) !== size(this.props.participants)) {
      const { participants, allParticipants } = nextProps;
      const { selectedItems } = this.state;
      const listCheckedItems = filter(selectedItems, (item: boolean) => item);

      if (size(participants) !== listCheckedItems.length) {
        forEach(allParticipants, (user: any) => {
          selectedItems[user.user_id] = true;
        });

        this.setState({
          selectedItems,
          isSelectedAll: true,
        });
      }
    }
  }

  onSave = () => {
    const { selectedItems } = this.state;
    const { onSelected, allParticipants, onCancel } = this.props;
    const listCheckedItems = pickBy(selectedItems, (status: boolean) => status);
    const selectedItemsChecked = keys(listCheckedItems) || [];
    const data = filter(allParticipants, item => {
      return includes(selectedItemsChecked, String(item.user_id));
    });
    if (isFunction(onSelected)) {
      onSelected(data);
    }
    if (isFunction(onCancel)) {
      onCancel();
    }
  };

  onChangeSelectedItem = (item: any, { checked }: any) => {
    const { selectedItems } = this.state;
    const { allParticipants } = this.props;
    const newSelectedItems = {
      ...selectedItems,
      [item.user_id]: checked,
    };

    this.setState({ selectedItems: newSelectedItems });
    if (!checked) {
      this.setState({ isSelectedAll: false });
    }
    const listCheckedItems = filter(
      newSelectedItems,
      (status: boolean) => status
    );
    if (size(allParticipants) === listCheckedItems.length) {
      this.setState({ isSelectedAll: true });
    }
  };

  toggleSelectedAll = ({ checked }: any) => {
    const { allParticipants } = this.props;
    const { selectedItems } = this.state;
    forEach(allParticipants, (user: any) => {
      selectedItems[user.user_id] = checked;
    });

    this.setState({
      selectedItems,
      isSelectedAll: checked,
    });
  };

  render() {
    const { selectedItems, isSelectedAll } = this.state;
    const { modelProps, classes, onCancel, allParticipants } = this.props;
    return (
      <Modal modelProps={{ ...modelProps, closeIcon: true }}>
        <div className={classes.modalContent}>
          <div className={classes.modalTop}>
            <div style={{ marginTop: 10 }}>
              <Heading headingProps={{ as: 'h3' }} type={HeadingType.BOLD_600}>
                EMAIL MY READERS
              </Heading>
            </div>
          </div>
          <Grid>
            <Table unstackable className={classes.table}>
              <Table.Header>
                <Table.Row className={classes.tableRow}>
                  <Table.HeaderCell
                    width={2}
                    className={cx(classes.tableHeaderRow, classes.centerCell)}>
                    <Checkbox
                      secondary
                      center
                      checkboxProps={{
                        checked: isSelectedAll,
                        onChange: (_, e) => this.toggleSelectedAll(e),
                      }}
                    />
                    <Heading
                      headingProps={{
                        as: 'h5',
                        textAlign: 'center',
                        className: 'selectAllHeading',
                      }}
                      colorVariant={HeadingColor.SECONDARY}
                      type={HeadingType.NORMAL}>
                      Select All
                    </Heading>
                  </Table.HeaderCell>
                  <Table.HeaderCell className={cx(classes.tableHeaderRow)}>
                    <Heading
                      headingProps={{ as: 'h5', textAlign: 'left' }}
                      colorVariant={HeadingColor.CYAN}
                      type={HeadingType.NORMAL}>
                      Email
                    </Heading>
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {map(allParticipants, (user: any, index: number) => {
                  return (
                    <TableRow className={classes.tableRow} key={index}>
                      <TableCell width={1}>
                        <div className={classes.iconContainer}>
                          <Checkbox
                            center
                            checkboxProps={{
                              checked: selectedItems[user.user_id],
                              onChange: (_, e) =>
                                this.onChangeSelectedItem(user, e),
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell width={6}>
                        <Heading
                          headingProps={{ as: 'h4' }}
                          type={HeadingType.NORMAL}>
                          {`${user.email}`}
                        </Heading>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </Table.Body>
            </Table>
          </Grid>
        </div>
        <Grid>
          <Grid.Row textAlign="center" verticalAlign="middle">
            <div className={classes.bottomButtons}>
              <Button
                colorVariant={ButtonColor.GRAY}
                buttonType={ButtonType.ROUND}
                buttonProps={{
                  type: 'button',
                  onClick: () => onCancel(),
                }}>
                Cancel
              </Button>
              <Button
                colorVariant={ButtonColor.SECONDARY}
                buttonType={ButtonType.ROUND}
                buttonProps={{
                  type: 'button',
                  onClick: this.onSave,
                }}>
                Save
              </Button>
            </div>
          </Grid.Row>
        </Grid>
      </Modal>
    );
  }
}
export default ParticipantsModal;
