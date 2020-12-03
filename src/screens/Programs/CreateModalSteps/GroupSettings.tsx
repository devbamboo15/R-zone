import * as React from 'react';
import { Grid, Icon } from 'semantic-ui-react';
import capitalize from 'lodash/capitalize';
import themr from 'src/helpers/themr';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import MessageBox from 'src/components/MessageBox';
import Input from 'src/components/FormFields/Input';
import Select from 'src/components/FormFields/Select';
import styles from './styles.scss';

type Props = IComponentProps & {
  jumpToNextStep?: Function; // coming from WizardStep component
  jumpToPreviousStep?: Function; // coming from WizardStep component
  onNext?: Function;
  initialData?: {
    amount: number;
    interval: string;
  };
  metric: any;
};

class GroupSettings extends React.Component<Props> {
  state = {
    amount: '',
    interval: 'daily',
  };

  componentDidMount() {
    const { initialData } = this.props;
    this.setState({
      amount: initialData.amount,
      interval: initialData.interval,
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.initialData !== prevProps.initialData) {
      const { initialData } = this.props;
      this.setState({
        amount: initialData.amount,
        interval: initialData.interval,
      });
    }
  }

  onNextPress = () => {
    const { jumpToNextStep, onNext } = this.props;
    if (onNext) {
      onNext({
        amount: this.state.amount,
        interval: this.state.interval,
      });
    }
    jumpToNextStep();
  };

  onBackPress = () => {
    const { jumpToPreviousStep } = this.props;
    jumpToPreviousStep();
  };

  renderSection() {
    const { classes, metric } = this.props;
    const { amount } = this.state;
    return (
      <>
        <Grid doubling className={classes.metrics}>
          <Grid.Row verticalAlign="bottom">
            <Grid.Column width={8}>
              <Input
                label="Goal Amount"
                inputProps={{
                  placeholder: '00',
                  type: 'text',
                  value: `${amount}`,
                  onChange: (_, { value }) => {
                    this.setState({ amount: value });
                  },
                }}
              />
            </Grid.Column>
            <Grid.Column width={3}>
              <div className={classes.goalSettingsMetric}>
                <span>{capitalize(metric)}</span>
                <Icon name="file alternate outline" size="small" />
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={8}>
              <Select
                label="Goal Frequency"
                selectProps={{
                  value: this.state.interval,
                  onChange: (_, data) => {
                    this.setState({
                      interval: data.value,
                    });
                  },
                  options: [
                    {
                      text: 'Daily',
                      value: 'daily',
                    },
                    {
                      text: 'Weekly',
                      value: 'week',
                    },
                    {
                      text: 'Monthly',
                      value: 'month',
                    },
                    {
                      text: 'Duration of Program',
                      value: 'program',
                    },
                  ],
                }}
              />
            </Grid.Column>
            <Grid.Column />
          </Grid.Row>
        </Grid>
        <MessageBox
          description={
            <div>
              If you want the goal amount to cover a given time frame, for
              example, 1000 minutes for the entire summer, select "
              <span className={classes.blueText}>Duration of Program</span>" as
              the Goal Frequency.
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
                  disabled: Number(this.state.amount) <= 0,
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

export default themr<Props>('GroupSettings', styles)(GroupSettings);
