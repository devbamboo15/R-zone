import * as React from 'react';
import cn from 'classnames';
import Input from 'src/components/FormFields/Input';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import PlusButtonSvg from 'src/assets/icons/plus.svg';
import EntryByDaySvg from 'src/assets/icons/EntryByDay.svg';
import CheckSvg from 'src/assets/icons/Check.svg';
import UpdateEntryWarningSvg from 'src/assets/icons/UpdateEntryWarning.svg';
import { capitalize } from 'src/helpers/methods';
import { DatesRangeInput } from 'semantic-ui-calendar-react';
import * as moment from 'moment';
import get from 'lodash/get';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import Spinner from 'src/components/Spinner';
import Modal from 'src/components/Modal';

export type Props = IComponentProps & {
  createReadingEntryLoading?: boolean;
  bulkEntryLoading?: boolean;
  createReadingEntry?: Function;
  getReaderEntires?: Function;
  addBulkEntry?: Function;
  successCallback: Function;
  readerId: string;
  readerIds?: string[];
  goalId: string;
  programId?: string;
  groupId?: string;
  groupMetricId?: string;
  readerEntries?: any[];
  entiresDays?: any[];
  readerEntriesLoading?: boolean;
};

interface IStates {
  dateRangeEntry?: any;
  entryNumber: string | number;
  entryInputError: string;
  focusInput: boolean;
  datesRange: string;
  showInput: boolean;
  firstTimePlaceholder: boolean;
  hasEntry: boolean;
  confirmAction: Function;
  openConfirmModal: boolean;
}

class AddEntry extends React.Component<Props, IStates> {
  state = {
    dateRangeEntry: {
      startDate: '',
      endDate: '',
    },
    entryNumber: '',
    entryInputError: '',
    focusInput: false,
    datesRange: '',
    showInput: false,
    firstTimePlaceholder: false,
    hasEntry: false,
    confirmAction: () => {},
    openConfirmModal: false,
  };

  componentDidMount() {
    const { getReaderEntires, readerId, groupId } = this.props;
    setTimeout(() => {
      this.setState({
        firstTimePlaceholder: true,
      });
    }, 2000);
    getReaderEntires(readerId, groupId);
    setTimeout(() => {
      const divs = document.querySelectorAll('.ui.circular.label');
      for (let i = 0; i < divs.length; ++i) {
        divs[i].parentElement.setAttribute('class', 'today');
      }
    }, 0);
  }

  handleChange = (event, { value }) => {
    const { entiresDays } = this.props;
    const entiresDaysParse = entiresDays.map(ed => ({
      ...ed,
      day: moment(ed.day).format('DD/MM/YYYY'),
    }));
    const dateValue = value.split(' - ');
    const startDate = dateValue[0] ? dateValue[0].replace(/-/g, '/') : '';
    const endDate = dateValue[1] ? dateValue[1].replace(/-/g, '/') : '';
    let eNumber = '';
    let foundDay = {};
    if (startDate && endDate && startDate === endDate) {
      foundDay = find(entiresDaysParse, { day: startDate }) || {};
      eNumber = get(foundDay, 'value', '');
    }
    this.setState({
      dateRangeEntry: {
        startDate,
        endDate,
      },
      datesRange: value,
      entryNumber: eNumber,
      showInput: !!(startDate && endDate),
      firstTimePlaceholder: true,
      hasEntry: !isEmpty(foundDay),
    });
  };

  closeInputBox = () => {
    this.setState({
      showInput: false,
    });
  };

  displayUSTime = val => {
    if (val) {
      const dateArr = val.toString().split('/');
      return `${dateArr[1] || ''}/${dateArr[0] || ''}/${dateArr[2] || ''}`;
    }
    return '';
  };

  render() {
    const {
      classes,
      createReadingEntryLoading,
      createReadingEntry,
      successCallback,
      readerId,
      goalId,
      readerIds,
      addBulkEntry,
      programId,
      groupId,
      bulkEntryLoading,
      groupMetricId,
      entiresDays,
      readerEntriesLoading,
    } = this.props;

    const {
      dateRangeEntry,
      entryNumber,
      entryInputError,
      focusInput,
      showInput,
      datesRange,
      firstTimePlaceholder,
      hasEntry,
      confirmAction,
      openConfirmModal,
    } = this.state;

    const marked =
      entiresDays.map(ed => {
        return moment(ed.day);
      }) || [];
    return (
      <div
        className={cn(
          classes.noteModalContainer,
          readerEntriesLoading && classes.loading
        )}>
        {readerEntriesLoading && <Spinner />}
        <div className="add-entry-calander">
          <div className={classes.addEntryDes}>
            <EntryByDaySvg /> = Days with reading entries
          </div>
          <DatesRangeInput
            name="datesRange"
            value={datesRange}
            iconPosition="left"
            onChange={this.handleChange}
            inline
            allowSameEndDate
            marked={!readerEntriesLoading ? marked : [moment()]}
          />
        </div>

        {showInput && (
          <div className={classes.entryNumberContent}>
            <div
              className={classes.entryNumberClose}
              onClick={this.closeInputBox}>
              <i className="close icon" />
            </div>
            <div className={classes.entryInputWrapper}>
              <Input
                inputProps={{
                  name: 'entry_number',
                  placeholder: '0',
                  type: 'number',
                  min: 0,
                  className: classes.entryInput,
                  value: entryNumber,
                  onChange: (_, { value }) => {
                    this.setState({
                      entryNumber: value,
                      entryInputError: value ? '' : 'Required!',
                      focusInput: true,
                    });
                  },
                  autoFocus: true,
                }}
                label={`Enter No. of ${capitalize(groupMetricId) || 'Pages'}`}
              />
            </div>
            <div className={classes.dateRangeTitle}>Date Range</div>
            <p className={classes.dateRangeValue}>
              {hasEntry ? (
                <>{this.displayUSTime(dateRangeEntry.startDate)}</>
              ) : (
                <>
                  {this.displayUSTime(dateRangeEntry.startDate)} -{' '}
                  {this.displayUSTime(dateRangeEntry.endDate)}
                </>
              )}
            </p>
            <div className={classes.entrySubmit}>
              <Button
                colorVariant={ButtonColor.PRIMARY_COLOR}
                icon={<PlusButtonSvg height={20} />}
                buttonType={ButtonType.ROUND}
                buttonProps={{
                  type: 'button',
                  onClick: () => {
                    if (entryNumber) {
                      let data = [];
                      if (dateRangeEntry.endDate === dateRangeEntry.startDate) {
                        data = [
                          {
                            date: dateRangeEntry.startDate
                              .split('/')
                              .reverse()
                              .join('/')
                              .replace(/\//g, '-'),
                            value: entryNumber,
                          },
                        ];
                      } else {
                        const validStartDate = this.displayUSTime(
                          dateRangeEntry.startDate
                        );
                        const validEndDate = this.displayUSTime(
                          dateRangeEntry.endDate
                        );
                        const momentStartDate = moment(validStartDate);
                        const momentEndDate = moment(validEndDate);
                        const numberOfDays = momentEndDate.diff(
                          momentStartDate,
                          'days'
                        );
                        for (let i = 0; i <= numberOfDays; i++) {
                          data.push({
                            date: moment(validStartDate)
                              .add(i, 'days')
                              .format('YYYY-MM-DD'),
                            value: entryNumber,
                          });
                        }
                      }
                      if (readerIds && readerIds.length > 0) {
                        const newData = [];
                        for (let i = 0; i < readerIds.length; i++) {
                          for (let j = 0; j < data.length; j++) {
                            newData.push({
                              date: data[j].date,
                              value: data[j].value,
                              user_id: readerIds[i],
                            });
                          }
                        }
                        if (hasEntry) {
                          this.setState({
                            openConfirmModal: true,
                            confirmAction: () => {
                              addBulkEntry(programId, groupId, newData, () => {
                                successCallback(readerId);
                                this.setState({
                                  openConfirmModal: false,
                                });
                              });
                            },
                          });
                        } else {
                          addBulkEntry(programId, groupId, newData, () => {
                            successCallback(readerId);
                          });
                        }
                      } else if (hasEntry) {
                        this.setState({
                          openConfirmModal: true,
                          confirmAction: () => {
                            createReadingEntry(readerId, goalId, data, () => {
                              successCallback(readerId);
                              this.setState({
                                openConfirmModal: false,
                              });
                            });
                          },
                        });
                      } else {
                        createReadingEntry(readerId, goalId, data, () => {
                          successCallback(readerId);
                        });
                      }
                    } else {
                      this.setState({
                        entryInputError: 'Required!',
                      });
                    }
                  },
                  loading: createReadingEntryLoading || bulkEntryLoading,
                  disabled: !!(!focusInput || entryInputError),
                }}>
                {hasEntry ? 'Save' : 'Add'}
              </Button>
            </div>
          </div>
        )}
        {!firstTimePlaceholder && (
          <div className={classes.addEntryPlaceholder}>
            <span>Select one or more days</span>
          </div>
        )}
        <Modal
          modelProps={{
            open: openConfirmModal,
            dimmer: 'blurring',
            size: 'mini',
            closeIcon: true,
            className: classes.confirmEntryModal,
            onClose: () => {
              this.setState({
                openConfirmModal: false,
              });
            },
          }}
          contentProps={{ className: classes.confirmEntryContent }}>
          <div className={classes.defaultChild}>
            <div className={classes.childInner}>
              <UpdateEntryWarningSvg />
              <h2 className={classes.confirmHeading}>Caution</h2>
              <p className={classes.confirmDes}>
                Making a reading entry will overwrite the existing entry for
                this day.
                <br />
                <br />
                Are you sure you want to proceed?
              </p>
              <div className={classes.buttonGroup}>
                <Button
                  colorVariant={ButtonColor.GRAY}
                  buttonType={ButtonType.ROUND}
                  buttonProps={{
                    onClick: () => {
                      this.setState({
                        openConfirmModal: false,
                      });
                    },
                  }}>
                  Cancel
                </Button>
                <Button
                  colorVariant={ButtonColor.PRIMARY}
                  icon={<CheckSvg height={20} />}
                  buttonType={ButtonType.ROUND}
                  buttonProps={{
                    onClick: confirmAction,
                    loading: createReadingEntryLoading || bulkEntryLoading,
                  }}>
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default AddEntry;
