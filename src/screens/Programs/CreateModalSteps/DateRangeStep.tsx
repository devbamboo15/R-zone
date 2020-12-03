import * as React from 'react';
import { Grid, Icon } from 'semantic-ui-react';
import themr from 'src/helpers/themr';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import MessageBox from 'src/components/MessageBox';
import DateRangePicker from 'src/components/DateRangePicker';
import * as moment from 'moment';
import styles from './styles.scss';

type Props = IComponentProps & {
  jumpToNextStep?: Function; // coming from WizardStep component
  jumpToPreviousStep?: Function; // coming from WizardStep component
  onNext?: Function;
  initialData?: {
    startDate: string;
    endDate: string;
  };
};

class DateRangeStep extends React.Component<Props> {
  state = {
    startDate: null,
    endDate: null,
  };

  componentDidMount() {
    const { initialData } = this.props;
    this.setState({
      startDate: initialData.startDate,
      endDate: initialData.endDate,
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.initialData !== prevProps.initialData) {
      const { initialData } = this.props;
      this.setState({
        startDate: moment(initialData.startDate),
        endDate: moment(initialData.endDate),
      });
    }
  }

  onNextPress = () => {
    const { jumpToNextStep, onNext } = this.props;
    const { startDate, endDate } = this.state;
    if (onNext) {
      onNext({ startDate, endDate });
    }
    jumpToNextStep();
  };

  onBackPress = () => {
    const { jumpToPreviousStep } = this.props;
    jumpToPreviousStep();
  };

  renderSection() {
    const { classes } = this.props;
    return (
      <>
        <Grid doubling className={classes.metrics}>
          <Grid.Row verticalAlign="bottom">
            <Grid.Column width={10}>
              <DateRangePicker
                label="Program Duration:"
                startDate={
                  this.state.startDate ? moment(this.state.startDate) : null
                }
                endDate={this.state.endDate ? moment(this.state.endDate) : null}
                onDatesChange={({ startDate, endDate }) => {
                  this.setState({
                    startDate,
                    endDate,
                  });
                }}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <MessageBox
          description={
            <div>
              Select the first and last dates you want to collect reading data.
              The dates can be adjusted anytime. There is no limit to how long a
              program can run.
            </div>
          }
        />
      </>
    );
  }

  renderButtons() {
    const { classes } = this.props;
    return (
      <>
        <Grid className={classes.buttonWrapper}>
          <Grid.Row columns="equal">
            <Grid.Column>
              <Button
                colorVariant={ButtonColor.MAIN}
                buttonType={ButtonType.ROUND}
                icon={<Icon name="arrow left" />}
                classes={{ button: classes.cancelButton }}
                buttonProps={{
                  onClick: this.onBackPress,
                }}>
                {'Back'}
              </Button>
            </Grid.Column>
            <Grid.Column>
              <Button
                colorVariant={ButtonColor.SECONDARY}
                buttonType={ButtonType.ROUND}
                icon={<Icon name="arrow right" />}
                buttonProps={{
                  onClick: this.onNextPress,
                  disabled: !this.state.startDate || !this.state.endDate,
                }}>
                Next
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.step}>
        {this.renderSection()}
        {this.renderButtons()}
      </div>
    );
  }
}

export default themr<Props>('DateRangeStep', styles)(DateRangeStep);
