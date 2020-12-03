import * as React from 'react';
import isFunction from 'lodash/isFunction';
import cx from 'classnames';
import omit from 'lodash/omit';
import { FormField } from 'semantic-ui-react';
import {
  DayPickerRangeController,
  DayPickerRangeControllerShape,
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
  DayPickerRangeControllerShape,
  'onFocusChange' | 'focusedInput'
>;

export type DateRangePickerProps = IComponentProps &
  BaseDatePickerProps & {
    label?: string;
    errorMessage?: any;
    readonly?: boolean;
    startDateErrorMessage?: string;
    endDateErrorMessage?: string;
  };

class DateRangPicker extends React.Component<DateRangePickerProps, IState> {
  startDateRef: any;

  endDateRef: any;

  state = {
    focusedInput: 'startDate' as any,
  };

  static defaultProps = {
    daySize: 39,
    noBorder: true,
    numberOfMonths: 1,
    startDate: null,
    endDate: null,
  };

  onDatesChange = ({ startDate, endDate }) => {
    if (isFunction(this.props.onDatesChange)) {
      this.props.onDatesChange({ startDate, endDate });
      if (this.state.focusedInput === 'endDate') {
        this.endDateRef.inputRef.current.click();
      }
    }
  };

  onFocusChange = focusedInput => {
    const { readonly } = this.props;
    // if focused input is start date , then click that input so that tooltip will be shown
    if (focusedInput === 'startDate' && !readonly) {
      this.startDateRef.inputRef.current.click();
    }
    // if focused input is end date , then click that input so that tooltip will be shown
    if (focusedInput === 'endDate' && !readonly) {
      this.endDateRef.inputRef.current.click();
    }
    this.setState({ focusedInput });
  };

  render() {
    const {
      classes,
      disabled,
      daySize,
      noBorder,
      numberOfMonths,
      label,
      startDate,
      readonly,
      endDate,
      errorMessage,
      startDateErrorMessage,
      endDateErrorMessage,
      ...rest
    } = this.props;
    const { focusedInput } = this.state;
    const restProps = omit(rest, ['mapThemrProps', 'composeTheme', 'theme']);

    const StartDateTrigger = ({ getTriggerProps, triggerRef }) => (
      <div
        {...getTriggerProps({
          ref: !readonly ? triggerRef : '',
          className: cx(
            classes.trigger,
            startDateErrorMessage ? classes.errorField : classes.validField
          ),
        })}>
        <Input
          inputProps={{
            disabled: readonly,
            ref: ref => {
              this.startDateRef = ref;
            },
            placeholder: 'Start Date',
            value: startDate ? startDate.format('MM/DD/YYYY') : '',
            onFocus: () => {
              this.setState({ focusedInput: 'startDate' });
            },
            icon: 'calendar outline',
          }}
        />
        {!!startDateErrorMessage && (
          <div
            className={cx(classes.errorMessage, classes.errorMessageOverlap)}>
            {startDateErrorMessage}
          </div>
        )}
      </div>
    );

    const EndDateTrigger = ({ getTriggerProps, triggerRef }) => (
      <div
        {...getTriggerProps({
          ref: !readonly ? triggerRef : '',
          className: cx(
            classes.trigger,
            endDateErrorMessage ? classes.errorField : classes.validField
          ),
        })}>
        <Input
          inputProps={{
            disabled: readonly,
            ref: ref => {
              this.endDateRef = ref;
            },
            placeholder: 'End Date',
            value: endDate ? endDate.format('MM/DD/YYYY') : '',
            onFocus: () => {
              this.setState({ focusedInput: 'endDate' });
            },
            icon: 'calendar outline',
          }}
        />
        {!!endDateErrorMessage && (
          <div
            className={cx(classes.errorMessage, classes.errorMessageOverlap)}>
            {endDateErrorMessage}
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
        <DayPickerRangeController
          {...restProps}
          startDate={startDate}
          endDate={endDate}
          onDatesChange={this.onDatesChange}
          focusedInput={focusedInput}
          onFocusChange={this.onFocusChange}
          disabled={disabled}
          daySize={daySize}
          renderDayContents={(day: moment.Moment) => (
            <span
              className={
                startDate && !endDate
                  ? 'CalendarDay__selected_onlyStart'
                  : 'CalendarDay__selected_bothDates'
              }>
              {day.format('D')}
            </span>
          )}
          numberOfMonths={numberOfMonths}
          noBorder={noBorder}
        />
      </div>
    );

    return (
      <div className={classes.container}>
        <FormField className={classes.column}>
          {label && (
            <Label classes={{ labelStyle: classes.label }}>{label}</Label>
          )}
          <div className={classes.inputs}>
            <TooltipTrigger
              placement="bottom"
              trigger="click"
              tooltip={Tooltip}>
              {StartDateTrigger}
            </TooltipTrigger>
            <TooltipTrigger
              placement="bottom"
              trigger="click"
              tooltip={Tooltip}>
              {EndDateTrigger}
            </TooltipTrigger>
          </div>
          {errorMessage && (
            <div
              className={cx(
                classes.errorMessage,
                !!startDateErrorMessage || !!endDateErrorMessage
                  ? classes.errorMessageOverlap
                  : classes.erorrMessageStatic
              )}>
              {errorMessage}
            </div>
          )}
        </FormField>
      </div>
    );
  }
}
export default DateRangPicker;
