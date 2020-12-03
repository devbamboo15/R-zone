import * as React from 'react';
import isFunction from 'lodash/isFunction';
import cx from 'classnames';
import omit from 'lodash/omit';
import { FormField, GridColumn, GridColumnProps } from 'semantic-ui-react';
import {
  DayPickerSingleDateController,
  DayPickerSingleDateControllerShape,
  FocusedInputShape,
} from 'react-dates';
import 'react-dates/initialize';
import TooltipTrigger from 'react-popper-tooltip';
import Label from 'src/components/FormFields/Label';
import Input from 'src/components/FormFields/Input';
import * as moment from 'moment';

export interface IState {
  focusedInput?: FocusedInputShape;
}

type BaseDatePickerProps = Omit<
  DayPickerSingleDateControllerShape,
  'onFocusChange' | 'focusedInput'
>;

export type SingleDatePickerProps = IComponentProps &
  BaseDatePickerProps & {
    label?: string;
    errorMessage?: any;
    readonly?: boolean;
    dateErrorMessage?: string;
    columnProps?: GridColumnProps;
    placeholder?: string;
  };

export type SingleDatePickerState = IState & {
  date: any;
};

class SingleDatePicker extends React.Component<
  SingleDatePickerProps,
  SingleDatePickerState
> {
  static defaultProps = {
    daySize: 39,
    noBorder: true,
    numberOfMonths: 1,
  };

  onDateChange = date => {
    if (isFunction(this.props.onDateChange)) {
      this.props.onDateChange(date);
    }
  };

  renderMonthElement = ({ month, onYearSelect }) => {
    const { classes } = this.props;
    const year = month.year();
    const yearOptions = [];

    for (let i = -100; i <= 0; ++i) {
      yearOptions.push(
        <option key={i} value={year + i}>
          {year + i}
        </option>
      );
    }

    return (
      <>
        <div className={classes.monthContainer}>
          <h4 className={classes.monthText}>{month.format('MMMM')}</h4>
          <select
            value={year}
            onChange={ev => {
              onYearSelect(month, ev.target.value);
            }}>
            {yearOptions}
          </select>
        </div>
      </>
    );
  };

  render() {
    const {
      classes,
      date,
      daySize,
      noBorder,
      numberOfMonths,
      label,
      readonly,
      dateErrorMessage,
      columnProps,
      placeholder,
      ...rest
    } = this.props;
    const restProps = omit(rest, ['mapThemrProps', 'composeTheme', 'theme']);

    const DateTrigger = ({ getTriggerProps, triggerRef }) => (
      <div
        {...getTriggerProps({
          ref: !readonly ? triggerRef : '',
          className: cx(
            classes.trigger,
            dateErrorMessage ? classes.errorField : classes.validField
          ),
        })}>
        <Input
          inputProps={{
            disabled: readonly,
            placeholder: placeholder || 'Start Date',
            value: date ? date.format('MM/DD/YYYY') : '',
            icon: 'calendar outline',
          }}
        />
        {!!dateErrorMessage && (
          <div
            className={cx(classes.errorMessage, classes.errorMessageOverlap)}>
            {dateErrorMessage}
          </div>
        )}
      </div>
    );

    const Tooltip = ({
      arrowRef,
      tooltipRef,
      getArrowProps,
      getTooltipProps,
      placement,
    }) => (
      <div
        {...getTooltipProps({
          ref: tooltipRef,
          className: 'tooltip-container',
        })}>
        <div
          {...getArrowProps({
            ref: arrowRef,
            className: 'tooltip-arrow',
            'data-placement': placement,
          })}
        />
        <DayPickerSingleDateController
          {...restProps}
          date={date}
          onDateChange={this.onDateChange}
          daySize={daySize}
          renderMonthElement={this.renderMonthElement}
          renderDayContents={(day: moment.Moment) => (
            <span className="CalendarDay__selected_bothDates">
              {day.format('D')}
            </span>
          )}
          numberOfMonths={numberOfMonths}
          noBorder={noBorder}
        />
      </div>
    );

    return (
      <GridColumn {...columnProps}>
        <FormField className={classes.column}>
          {label && (
            <Label classes={{ labelStyle: classes.label }}>{label}</Label>
          )}
          <div className={classes.inputs}>
            <TooltipTrigger placement="auto" trigger="click" tooltip={Tooltip}>
              {DateTrigger}
            </TooltipTrigger>
          </div>
        </FormField>
      </GridColumn>
    );
  }
}
export default SingleDatePicker;
