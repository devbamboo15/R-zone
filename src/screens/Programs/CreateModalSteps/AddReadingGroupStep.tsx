import * as React from 'react';
import { Grid, Icon } from 'semantic-ui-react';
import themr from 'src/helpers/themr';
import Input from 'src/components/FormFields/Input';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import MessageBox, { MessageBoxVariant } from 'src/components/MessageBox';
import styles from './styles.scss';

type Props = IComponentProps & {
  jumpToNextStep?: Function; // coming from WizardStep component
  jumpToPreviousStep?: Function; // coming from WizardStep component
  message?: string | React.ReactElement;
  initialGroupName?: string;
  onNext?: (value: string) => any;
  isFirstStep?: boolean;
  onCancel?: Function;
};

class AddReadingGroupStep extends React.Component<Props> {
  static defaultProps = {
    isFirstStep: false,
  };

  state = {
    readingGroup: '',
  };

  componentDidMount() {
    this.setState({ readingGroup: this.props.initialGroupName });
  }

  componentDidUpdate(prevProps) {
    if (this.props.initialGroupName !== prevProps.initialGroupName) {
      this.setState({ readingGroup: this.props.initialGroupName });
    }
  }

  onNextPress = () => {
    const { jumpToNextStep, onNext } = this.props;
    if (onNext) {
      onNext(this.state.readingGroup);
    }
    jumpToNextStep();
  };

  onBackPress = () => {
    const { isFirstStep, onCancel } = this.props;
    if (!isFirstStep) {
      const { jumpToPreviousStep } = this.props;
      jumpToPreviousStep();
    } else if (onCancel) {
      onCancel();
    }
  };

  renderPart1() {
    const { classes, message } = this.props;
    const { readingGroup } = this.state;
    return (
      <>
        <Grid className={classes.inputs}>
          <Grid.Row columns="1">
            <Grid.Column>
              <Input
                label="Group Name"
                inputProps={{
                  placeholder: '6th Grade Readers',
                  onChange: (_, { value }) => {
                    this.setState({
                      readingGroup: value,
                    });
                  },
                  value: readingGroup,
                }}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <MessageBox
          variant={MessageBoxVariant.INFO}
          description={
            message || (
              <div>
                A reading program can have an unlimited number of reading groups
                according to classroom, grade level, reading level, etc. Give
                your groups descriptive names like{' '}
                <span className={classes.blueText}>Mr. Book's Class</span> or{' '}
                <span className={classes.blueText}>
                  4th Grade Summer Readers
                </span>
                .
              </div>
            )
          }
        />
      </>
    );
  }

  renderButtons() {
    const { classes, isFirstStep } = this.props;
    const { readingGroup } = this.state;
    return (
      <>
        <Grid className={classes.buttonWrapper}>
          <Grid.Row columns="equal">
            <Grid.Column>
              <Button
                colorVariant={
                  !isFirstStep ? ButtonColor.MAIN : ButtonColor.DANGER
                }
                buttonType={ButtonType.ROUND}
                icon={<Icon name={!isFirstStep ? 'arrow left' : 'ban'} />}
                classes={{ button: classes.cancelButton }}
                buttonProps={{
                  onClick: this.onBackPress,
                }}>
                {!isFirstStep ? 'Back' : 'Cancel'}
              </Button>
            </Grid.Column>
            <Grid.Column>
              <Button
                colorVariant={ButtonColor.SECONDARY}
                buttonType={ButtonType.ROUND}
                icon={<Icon name="arrow right" />}
                buttonProps={{
                  onClick: this.onNextPress,
                  disabled: !readingGroup,
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
        {this.renderPart1()}
        {this.renderButtons()}
      </div>
    );
  }
}

export default themr<Props>('AddReadingGroupStep', styles)(AddReadingGroupStep);
