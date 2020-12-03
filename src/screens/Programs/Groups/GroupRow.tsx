import * as React from 'react';
import * as H from 'history';
import { Formik } from 'formik';
import cx from 'classnames';
import * as Yup from 'yup';
import themr from 'src/helpers/themr';
import { Accordion, Grid, Icon } from 'semantic-ui-react';
import urls from 'src/helpers/urls';
import Heading, { HeadingType, HeadingColor } from 'src/components/Heading';
import Select from 'src/components/FormFields/Select';
import Input from 'src/components/FormFields/Input';
import { confirmModal } from 'src/components/Modal/ConfirmationModal';
import Button, { ButtonType, ButtonColor } from 'src/components/Button';
import idx from 'idx';
import get from 'lodash/get';
import * as moment from 'moment';
import { formatNumber } from 'src/helpers/number';
import { Metric, Interval } from 'src/store/types';
import DateRangePicker from 'src/components/DateRangePicker';
import { IOrganizerGroup } from 'src/store/types/common';
import tableStyles from 'src/components/Table/styles.scss';
import MedalSvg from 'src/assets/icons/medal.svg';
import PencilIcon from 'src/assets/icons/pencil.svg';
import styles from '../styles.scss';
import ProgressDetail from '../Progress/Detail';
import ProgressPercentage from '../Progress/Percentage';

export type Props = IComponentProps & {
  group: IOrganizerGroup;
  history: H.History;
  onPlusIconClick: Function;
  isActive: boolean;
  onDeleteGroup: Function;
  isDeleting: boolean;
  onUpdateGroup: Function;
  isUpdating: boolean;
  completionProgress?: number;
  onOpenGroupBankModal?: Function;
  readingLog?: number;
  readingLogProgress: any;
  userAccessProgram: any;
  dropdownUpward?: boolean;
};

class GroupRow extends React.Component<Props> {
  goToReaders = () => {
    const { history, group } = this.props;
    history.push(
      urls.READERS({
        programId: group.attributes.program_id,
        groupId: group.id,
      })
    );
  };

  render() {
    const {
      classes,
      isActive,
      group,
      onPlusIconClick,
      isUpdating,
      onUpdateGroup,
      onDeleteGroup,
      completionProgress = 0,
      onOpenGroupBankModal,
      readingLog,
      readingLogProgress,
      userAccessProgram,
      dropdownUpward,
    } = this.props;
    const totalBooks = idx(group, x => x.books.length) || 0;
    const isReadingLog = idx(group, x => x.goal.attributes.reading_log);
    const goalId = idx(group, x => x.goal.id);
    const programId = group.attributes.program_id;
    const groupId = group.id;
    const startDateVal = moment(idx(group, x => x.goal.attributes.start_date));
    const endDateVal = moment(idx(group, x => x.goal.attributes.end_date));
    const now = moment();
    const statusLabel =
      now > endDateVal ? 'Ended' : now >= startDateVal ? 'Started' : 'Starts';
    const statusColor =
      now > endDateVal
        ? HeadingColor.DANGER
        : now >= startDateVal
        ? HeadingColor.PRIMARY1
        : HeadingColor.SECONDARY;
    const accessGroupByProgram = get(
      userAccessProgram,
      `group_by_program[${programId}][${groupId}]`,
      {}
    );
    return (
      <div
        className={cx(
          classes.mainStyles.rowStyle,
          classes.tableStyles.tableRowReuse,
          { [classes.tableStyles.tableRowReuseActive]: isActive }
        )}>
        <Formik
          enableReinitialize
          initialValues={{
            name: idx(group, x => x.attributes.name),
            metric_id: idx(group, x => x.goal.attributes.metric_id),
            interval_id: idx(group, x => x.goal.attributes.interval_id),
            start_date: moment(idx(group, x => x.goal.attributes.start_date)),
            end_date: moment(idx(group, x => x.goal.attributes.end_date)),
            value: idx(group, x => x.goal.attributes.value),
          }}
          onSubmit={values => {
            const data: any = {
              group: {
                name: values.name,
              },
              goal: {
                start_date: moment(values.start_date).format('YYYY-MM-DD'),
                end_date: moment(values.end_date).format('YYYY-MM-DD'),
                value: !isReadingLog ? `${values.value}` : 0,
                metric_id: values.metric_id,
                interval_id: !isReadingLog ? values.interval_id : null,
              },
            };
            onUpdateGroup(group.attributes.program_id, group.id, data);
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required('Name is required'),
          })}>
          {formProps => {
            const { values } = formProps;
            return (
              <form
                className={cx(classes.mainStyles.formAccordion, {
                  [classes.mainStyles.isActiveAccordion]: isActive,
                })}
                onSubmit={formProps.handleSubmit}>
                <Accordion.Title
                  active={isActive}
                  className={classes.mainStyles.accordionTitle}>
                  {accessGroupByProgram.write && (
                    <div
                      onClick={() => {
                        this.props.history.push(
                          urls.UPDATE_PROGRAM_ADVANCED({
                            programId,
                          })
                        );
                      }}
                      className={cx(
                        classes.tableStyles.hoverPencilIcon,
                        classes.mainStyles.hoverIcon
                      )}>
                      <PencilIcon height={15} width={15} />
                    </div>
                  )}
                  <Grid
                    className={classes.mainStyles.accordionGrid}
                    padded
                    verticalAlign="middle">
                    {isActive ? (
                      <Grid.Column width={4}>
                        <div>
                          <Input
                            inputProps={{
                              name: 'name',
                              value: values.name,
                              onChange: (_, { value }) => {
                                formProps.setFieldValue('name', value);
                              },
                              disabled: !accessGroupByProgram.write,
                            }}
                          />
                        </div>
                      </Grid.Column>
                    ) : (
                      <Grid.Column width={4} onClick={this.goToReaders}>
                        <Heading
                          headingProps={{ as: 'h5' }}
                          type={HeadingType.BOLD_500}>
                          {group.attributes.name}
                        </Heading>
                      </Grid.Column>
                    )}

                    <Grid.Column width={1} onClick={this.goToReaders}>
                      <Heading
                        headingProps={{ as: 'h5' }}
                        type={HeadingType.BOLD_500}>
                        {formatNumber(group.attributes.total_readers)}
                      </Heading>
                    </Grid.Column>
                    <Grid.Column width={1} onClick={this.goToReaders}>
                      <Heading
                        headingProps={{ as: 'h5' }}
                        type={HeadingType.BOLD_500}
                        colorVariant={HeadingColor.GRAY}>
                        {idx(group, x => x.goal.attributes.metric_id)}
                      </Heading>
                    </Grid.Column>
                    <Grid.Column width={2} onClick={this.goToReaders}>
                      <Heading
                        headingProps={{ as: 'h5' }}
                        type={HeadingType.BOLD_500}>
                        <div>
                          <Heading
                            headingProps={{ as: 'h6' }}
                            type={HeadingType.NORMAL}
                            colorVariant={statusColor}>
                            {statusLabel}
                          </Heading>
                          <Heading
                            headingProps={{ as: 'h5' }}
                            type={HeadingType.NORMAL}>
                            {statusColor === HeadingColor.DANGER
                              ? moment(
                                  idx(group, x => x.goal.attributes.end_date)
                                ).format('MM/DD/YYYY')
                              : moment(
                                  idx(group, x => x.goal.attributes.start_date)
                                ).format('MM/DD/YYYY')}
                          </Heading>
                        </div>
                      </Heading>
                    </Grid.Column>
                    <Grid.Column width={6} onClick={this.goToReaders}>
                      <Grid verticalAlign="middle">
                        {readingLog ? (
                          <Grid.Column width="16">
                            <ProgressDetail
                              readingLogProgress={readingLogProgress}
                            />
                          </Grid.Column>
                        ) : (
                          <ProgressPercentage
                            completionProgress={completionProgress}
                          />
                        )}
                      </Grid>
                    </Grid.Column>
                    <Grid.Column
                      width={2}
                      className={classes.mainStyles.accordionTitleLastColumn}>
                      {isActive && formProps.dirty && (
                        <Button
                          icon={<Icon name="save outline" />}
                          buttonType={ButtonType.ROUND}
                          colorVariant={ButtonColor.SUCCESS_FADE}
                          classes={{
                            button: classes.mainStyles.fontWeightNormal,
                          }}
                          buttonProps={{
                            size: 'tiny',
                            type: 'submit',
                            loading: isUpdating,
                          }}>
                          Save
                        </Button>
                      )}
                      {!isActive && (
                        <Icon
                          name="plus"
                          className={classes.mainStyles.plusIcon}
                          onClick={() => onPlusIconClick(group.id)}
                        />
                      )}
                      {isActive && !formProps.dirty && (
                        <Icon
                          name="minus"
                          className={classes.mainStyles.plusIcon}
                          onClick={() => onPlusIconClick('')}
                        />
                      )}
                    </Grid.Column>
                  </Grid>
                </Accordion.Title>
                <Accordion.Content active={isActive}>
                  <div className={classes.mainStyles.accordionContent}>
                    <div
                      className={cx(
                        classes.mainStyles.leftPart,
                        classes.mainStyles.groupLeftPart,
                        classes.mainStyles.flex1
                      )}>
                      <div
                        className={cx(
                          classes.mainStyles.field,
                          classes.mainStyles.flex1
                        )}>
                        <Select
                          selectProps={{
                            upward: dropdownUpward,
                            options: [
                              {
                                text: 'Pages',
                                value: Metric.pages,
                              },
                              {
                                text: 'Chapters',
                                value: Metric.chapters,
                              },
                              {
                                text: 'Books',
                                value: Metric.books,
                              },
                              {
                                text: 'Minutes',
                                value: Metric.minutes,
                              },
                              {
                                text: 'Yes/NO',
                                value: Metric['yes/no'],
                              },
                            ],
                            placeholder: 'Metric',
                            name: 'metric',
                            value: values.metric_id,
                            onChange: (_, { value }) => {
                              formProps.setFieldValue('metric_id', value);
                            },
                            disabled: !accessGroupByProgram.write,
                          }}
                          label="Metric"
                        />
                      </div>
                      {!isReadingLog && (
                        <div
                          className={cx(
                            classes.mainStyles.field,
                            classes.mainStyles.flex1,
                            classes.mainStyles.maxWidth80
                          )}>
                          <Input
                            inputProps={{
                              placeholder: '0',
                              name: 'Quantity',
                              value: values.value,
                              onChange: (_, { value }) => {
                                formProps.setFieldValue('value', value);
                              },
                              disabled: !accessGroupByProgram.write,
                            }}
                            label="Quantity"
                          />
                        </div>
                      )}
                      {!isReadingLog && (
                        <div
                          className={cx(
                            classes.mainStyles.field,
                            classes.mainStyles.flex1
                          )}>
                          <Select
                            selectProps={{
                              upward: dropdownUpward,
                              options: [
                                {
                                  text: 'Duration of Program',
                                  value: Interval.program,
                                },
                                {
                                  text: 'Daily',
                                  value: Interval.daily,
                                },
                                {
                                  text: 'Weekly',
                                  value: Interval.week,
                                },
                                {
                                  text: 'Monthly',
                                  value: Interval.month,
                                },
                              ],
                              placeholder: 'Frequency',
                              name: 'interval_id',
                              value: values.interval_id,
                              onChange: (_, { value }) => {
                                formProps.setFieldValue('interval_id', value);
                              },
                              disabled: !accessGroupByProgram.write,
                            }}
                            label="Frequency"
                          />
                        </div>
                      )}
                      <div
                        className={cx(
                          classes.mainStyles.field,
                          classes.mainStyles.flex1,
                          classes.mainStyles.maxWidth300
                        )}>
                        <DateRangePicker
                          startDate={values.start_date}
                          endDate={values.end_date}
                          readonly={!accessGroupByProgram.write}
                          label="From - To"
                          onDatesChange={({ startDate, endDate }) => {
                            formProps.setFieldValue('start_date', startDate);
                            formProps.setFieldValue('end_date', endDate);
                          }}
                        />
                      </div>
                    </div>
                    <div
                      className={cx(
                        classes.mainStyles.rightPart,
                        classes.mainStyles.groupRightPart
                      )}>
                      <div style={{ display: 'flex' }}>
                        <div className={cx(classes.mainStyles.field)}>
                          <Button
                            buttonType={ButtonType.ROUND}
                            colorVariant={ButtonColor.SECONDARY}
                            numberText={totalBooks}
                            classes={{
                              button: cx(
                                classes.mainStyles.rightPartButton,
                                classes.mainStyles.groupbankButton
                              ),
                            }}
                            buttonProps={{
                              size: 'tiny',
                              onClick: () => {
                                onOpenGroupBankModal(totalBooks, group);
                              },
                              type: 'button',
                            }}>
                            Group Book Bank
                          </Button>
                        </div>
                        <div className={cx(classes.mainStyles.field)}>
                          {goalId && readingLog < 2 && (
                            <Button
                              buttonType={ButtonType.ROUND}
                              colorVariant={ButtonColor.YELLOW}
                              icon={<MedalSvg width={15} height={15} />}
                              classes={{
                                button: classes.mainStyles.rightPartButton,
                              }}
                              buttonProps={{
                                size: 'tiny',
                                type: 'button',
                                onClick: () => {
                                  this.props.history.push(
                                    urls.GROUPS_AWARDS({
                                      programId,
                                      groupId,
                                    })
                                  );
                                },
                              }}>
                              Awards
                            </Button>
                          )}
                        </div>
                      </div>
                      {accessGroupByProgram.write && (
                        <div
                          className={cx(
                            classes.mainStyles.field,
                            classes.mainStyles.fieldEnd
                          )}>
                          <Button
                            buttonType={ButtonType.ROUND}
                            colorVariant={ButtonColor.DANGER_FADE}
                            classes={{
                              button: classes.mainStyles.rightPartButton,
                            }}
                            buttonProps={{
                              size: 'tiny',
                              type: 'button',
                              onClick: () => {
                                confirmModal.open({
                                  message:
                                    'This will delete this Group. You will lose all associated Readers, along with their data. Are you absolutely sure? WARNING: This cannot be undone.',
                                  onOkClick: () =>
                                    onDeleteGroup(
                                      group.attributes.program_id,
                                      group.id
                                    ),
                                });
                              },
                            }}>
                            Delete Group
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Accordion.Content>
              </form>
            );
          }}
        </Formik>
      </div>
    );
  }
}

export default themr<Props>('GroupRow', { mainStyles: styles, tableStyles })(
  GroupRow
);
