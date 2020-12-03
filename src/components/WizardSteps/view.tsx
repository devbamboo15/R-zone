import * as React from 'react';
import cx from 'classnames';
import { Icon } from 'semantic-ui-react';
import * as H from 'history';
import * as queryString from 'query-string';
import get from 'lodash/get';

interface Step {
  icon?: React.ReactElement;
  title: string | React.ReactElement;
  // Component will get `jumpToNextStep` and `jumpToPreviousStep` in props, so component can go to prev or next step
  component: React.ReactElement;
  completedStepIcon?: React.ReactElement;
}

export type Props = IComponentProps & {
  steps: Step[];
  history?: H.History;
  checkValidToken?: Function;
};

interface InternalProps {
  activeStepIndex: number;
  setActiveStepIndex: Function;
}

class WizardSteps extends React.Component<Props & InternalProps> {
  static defaultProps = {
    steps: [],
  };

  componentDidMount() {
    const { history, checkValidToken } = this.props;
    const params = queryString.parse(history.location.search);
    const preSelectedPlanId = get(params, 'pre_selected_planid');
    let email = get(params, 'email', '');
    if (email.includes(' ')) {
      email = encodeURIComponent(email.replace(/ /g, '+'));
    }
    const token = get(params, 'token');
    if (preSelectedPlanId) {
      this.jumpToNextStep();
    }
    if (email && token && checkValidToken) {
      checkValidToken(token, email, () => {
        this.jumpToNextStep();
      });
    }
  }

  jumpToNextStep = () => {
    const { setActiveStepIndex, activeStepIndex, steps } = this.props;
    if (activeStepIndex < steps.length - 1) {
      setActiveStepIndex(activeStepIndex + 1);
    }
  };

  jumpToPreviousStep = () => {
    const { setActiveStepIndex, activeStepIndex } = this.props;
    if (activeStepIndex > 0) {
      setActiveStepIndex(activeStepIndex - 1);
    }
  };

  renderSteps() {
    const { classes, activeStepIndex, steps } = this.props;
    return (
      <div className={classes.steps}>
        {steps.map((step, index) => {
          const isFirst = index === 0;
          const isLast = index === steps.length - 1;
          const isActive = index === activeStepIndex;
          const isCompleted = index < activeStepIndex;

          let content = null;
          if (isCompleted) {
            content = step.completedStepIcon ? (
              step.completedStepIcon
            ) : (
              <Icon
                name="check"
                size="small"
                style={{ margin: 0, fontSize: 11 }}
              />
            );
          } else if (isActive) {
            content = `00${activeStepIndex + 1}`.slice(-2);
          }

          return (
            <div className={classes.step} key={index}>
              {/* Render left line before step indicator */}
              <div
                className={cx(classes.stepLine, {
                  [classes.stepLineHide]: isFirst,
                  [classes.stepLineActive]: isActive,
                  [classes.stepLineComplete]: isCompleted,
                })}
              />
              {/* Render step indicator */}
              <div
                className={cx(classes.stepIndicator, {
                  [classes.stepIndicatorActive]: isActive,
                  [classes.stepIndicatorComplete]: isCompleted,
                })}>
                {content}
              </div>
              {/* Render right line after step indicator */}
              <div
                className={cx(classes.stepLine, {
                  [classes.stepLineHide]: isLast,
                  [classes.stepLineActive]: isActive,
                  [classes.stepLineComplete]: isCompleted,
                })}
              />
            </div>
          );
        })}
      </div>
    );
  }

  renderStepComponent() {
    const { classes, activeStepIndex, steps } = this.props;
    const activeStep = steps[activeStepIndex] || ({} as Step);
    // component will get `jumpToNextStep` and `jumpToPreviousStep` in props,
    // so component can go to prev or next step
    const clonedComponent = React.cloneElement(activeStep.component, {
      jumpToNextStep: this.jumpToNextStep,
      jumpToPreviousStep: this.jumpToPreviousStep,
    });
    return <div className={classes.component}>{clonedComponent}</div>;
  }

  render() {
    const { classes, activeStepIndex, steps } = this.props;
    const activeStep = steps[activeStepIndex] || ({} as Step);
    return (
      <div className={classes.wrapper}>
        {/* Render Active Step Icon if given */}
        {activeStep.icon && (
          <div className={classes.icon}>{activeStep.icon}</div>
        )}
        {/* Render Active Step Title if given */}
        {activeStep.title && (
          <div className={classes.title}>{activeStep.title}</div>
        )}
        {/* Render steps */}
        {this.renderSteps()}
        {/* Render Step Component */}
        {this.renderStepComponent()}
      </div>
    );
  }
}

export default WizardSteps;
