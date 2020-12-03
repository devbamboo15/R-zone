import * as React from 'react';
import themr from 'src/helpers/themr';
import cn from 'classnames';
import isBoolean from 'lodash/isBoolean';
import Button, { ButtonType } from 'src/components/Button';
import ArrowRightSvg from 'src/assets/icons/ArrowRight.svg';
import CheckCircleSvg from 'src/assets/icons/CheckCircle.svg';
import { isNewValueAsObject } from '../../utils';

import styles from '../../styles.scss';

export type Props = IComponentProps & {
  formProps: any;
  stepData: any[];
  stepMapping: any;
  setStep: Function;
  step: number;
  buttonLoading: boolean;
  role?: string;
};

export interface IStep {
  label: any;
  input: any;
  newValueStep?: any;
  loading?: boolean;
}

const hasValue = value => {
  return (
    isBoolean(value) || (value && value !== 'new' && !isNewValueAsObject(value))
  );
};

const Step = props => {
  const {
    classes,
    formProps,
    stepData,
    stepMapping,
    step,
    setStep,
    buttonLoading,
  } = props;
  const stepLength = stepData.length;
  const { values } = formProps;
  const isDisabled = () => {
    return (
      !hasValue(values[stepMapping[step]]) ||
      (step === stepLength &&
        values.metricId === 'books' &&
        values.book.length < Number(values.metric)) ||
      buttonLoading
    );
  };

  return (
    <div className={classes.stepWrapper}>
      {stepData.map((s: any, i: number) => {
        const stepIndex = i + 1;
        if (stepIndex === 1 || step >= stepIndex) {
          return (
            <React.Fragment key={i}>
              <div className={classes.step}>
                <label>{s.label}</label>
                {s.input}
              </div>
              {(values[stepMapping[step]] === 'new' ||
                isNewValueAsObject(values[stepMapping[step]])) &&
                step === stepIndex &&
                !s.loading &&
                s.newValueStep}
            </React.Fragment>
          );
        }
        return null;
      })}
      <div className={classes.actionButtons}>
        <Button
          buttonType={ButtonType.ROUND}
          icon={
            step < stepLength ? (
              <ArrowRightSvg size={20} />
            ) : (
              <CheckCircleSvg size={20} />
            )
          }
          btnClass={cn(classes.button, step === stepLength && classes.doneBtn)}
          buttonProps={{
            size: 'large',
            type: step === stepLength ? 'submit' : 'button',
            disabled: isDisabled(),
            loading: buttonLoading,
            onClick: () => {
              if (step < stepLength) {
                setStep(step + 1);
              }
            },
          }}>
          {step < stepLength ? 'Next' : 'Done'}
        </Button>
      </div>
    </div>
  );
};

export default themr<Props>('Step', styles)(Step);
