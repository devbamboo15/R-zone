import * as React from 'react';
import { Grid, Icon } from 'semantic-ui-react';
import themr from 'src/helpers/themr';
import Input from 'src/components/FormFields/Input';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import MessageBox, { MessageBoxVariant } from 'src/components/MessageBox';
import DescriptionBlock from 'src/components/DescriptionBlock';
import OpenBook from 'src/assets/icons/open_book.svg';
import OpenBookActive from 'src/assets/icons/open_book_active.svg';
import Dart from 'src/assets/icons/dart.svg';
import DartActive from 'src/assets/icons/dart_active.svg';
import Cup from 'src/assets/icons/cup.svg';
import CupActive from 'src/assets/icons/cup_active.svg';
import ProgramCode from 'src/components/ProgramCode';
import idx from 'idx';
import styles from './styles.scss';

interface Step1Data {
  code?: string;
  programName?: string;
  progress?: StepOneProgress;
  selection?: StepOneProgramTypeSelection;
  readingLogSelection?: StepOneProgramTypeSelection;
}

type Props = IComponentProps & {
  jumpToNextStep?: Function; // coming from WizardStep component
  jumpToPreviousStep?: Function; // coming from WizardStep component
  onCancel: Function;
  onNext: (value: Step1Data) => any;
  initialData?: Step1Data;
};

export enum StepOneProgress {
  NONE = -1,
  PART1 = 'PART1',
  PART2 = 'PART2',
  PART3 = 'PART3',
}

export enum StepOneProgramTypeSelection {
  NONE = -1,
  GOAL_BASED = 'GOAL_BASED',
  READING_LOG = 'READING_LOG',
  PROMOTE_READING = 'PROMOTE_READING',
  HOLD_CONTEST = 'HOLD_CONTEST',
}

class Step1 extends React.Component<Props> {
  static defaultProps = {
    onNext: () => {},
  };

  state = {
    progress: StepOneProgress.PART1,
    selection: StepOneProgramTypeSelection.NONE,
    readingLogSelection: StepOneProgramTypeSelection.NONE,
    programName: '',
    code: '',
  };

  componentDidMount() {
    this.setState({
      progress: idx(this.props, x => x.initialData.progress),
      selection: idx(this.props, x => x.initialData.selection),
      readingLogSelection: idx(
        this.props,
        x => x.initialData.readingLogSelection
      ),
      programName: idx(this.props, x => x.initialData.programName),
      code: idx(this.props, x => x.initialData.code),
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.initialData !== prevProps.initialData) {
      this.setState({
        progress: idx(this.props, x => x.initialData.progress),
        selection: idx(this.props, x => x.initialData.selection),
        readingLogSelection: idx(
          this.props,
          x => x.initialData.readingLogSelection
        ),
        programName: idx(this.props, x => x.initialData.programName),
      });
    }
  }

  onNextPress = () => {
    const { jumpToNextStep, onNext } = this.props;
    const {
      progress,
      selection,
      readingLogSelection,
      programName,
    } = this.state;

    if (progress === StepOneProgress.PART1) {
      // if user entered program name, then render part 2
      this.setState({
        progress: StepOneProgress.PART2,
      });
      onNext({
        programName,
        progress: StepOneProgress.PART2,
        selection,
        readingLogSelection,
      });
    } else if (
      progress === StepOneProgress.PART2 &&
      selection === StepOneProgramTypeSelection.GOAL_BASED
    ) {
      // if we are at part 2 and user select Reading Log, then navigate to step 2
      onNext({
        programName,
        progress,
        selection,
        readingLogSelection,
      });
      jumpToNextStep();
    } else if (
      progress === StepOneProgress.PART2 &&
      selection === StepOneProgramTypeSelection.READING_LOG
    ) {
      // if we are at part 2 and user select Goal Based, then render part 3
      this.setState({
        progress: StepOneProgress.PART3,
      });
      onNext({
        programName,
        progress: StepOneProgress.PART3,
        selection,
        readingLogSelection,
      });
    } else if (
      progress === StepOneProgress.PART3 &&
      readingLogSelection === StepOneProgramTypeSelection.PROMOTE_READING
    ) {
      // if we are at part 3, then navigate to next step
      jumpToNextStep();
      onNext({
        programName,
        progress,
        selection,
        readingLogSelection,
      });
    } else if (
      progress === StepOneProgress.PART3 &&
      readingLogSelection === StepOneProgramTypeSelection.HOLD_CONTEST
    ) {
      // if we are at part 3, then navigate to next step
      jumpToNextStep();
      onNext({
        programName,
        progress,
        selection,
        readingLogSelection,
      });
    }
  };

  onBackPress = () => {
    const { onCancel } = this.props;
    const { progress } = this.state;
    if (progress === StepOneProgress.PART1) {
      onCancel();
    } else if (progress === StepOneProgress.PART2) {
      this.setState({
        progress: StepOneProgress.PART1,
      });
    } else if (progress === StepOneProgress.PART3) {
      this.setState({
        progress: StepOneProgress.PART2,
      });
    }
  };

  renderPart1() {
    const { classes } = this.props;
    const { programName, code } = this.state;
    return (
      <>
        <Grid className={classes.inputs}>
          <Grid.Row columns="2">
            <Grid.Column width={11}>
              <Input
                label="Program Name"
                inputProps={{
                  placeholder: 'Washington Elementary',
                  onChange: (_, { value }) => {
                    this.setState({
                      programName: value,
                    });
                  },
                  value: programName,
                }}
              />
            </Grid.Column>
            <Grid.Column width={5}>
              <ProgramCode label="Program Code" code={code} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <MessageBox
          variant={MessageBoxVariant.INFO}
          description={
            <div>
              A best practice is creating as few Reading Programs as possible.
              You can utilize multiple Reading Groups within each program to
              accommodate different types of reading goals.
              <br />
              <br />
              Each Reading Program has a unique Reading Program Code. This code
              allows prospective readers to find and join your Reading Program
            </div>
          }
        />
      </>
    );
  }

  renderPart2() {
    const { selection } = this.state;
    return (
      <>
        <Grid doubling columns="2">
          <Grid.Row>
            <Grid.Column>
              <DescriptionBlock
                icon={<Dart height={50} />}
                iconActive={<DartActive height={50} />}
                title="Goal-Based"
                description="Set a fixed goal for your readers to achieve. The goal will be the same for all readers within this reading group"
                note="Example: 400 minutes per month."
                isSelected={
                  selection === StepOneProgramTypeSelection.GOAL_BASED
                }
                onClick={() => {
                  this.setState({
                    selection: StepOneProgramTypeSelection.GOAL_BASED,
                  });
                }}
              />
            </Grid.Column>
            <Grid.Column>
              <DescriptionBlock
                icon={<OpenBook height={50} />}
                iconActive={<OpenBookActive height={50} />}
                title="Reading Log"
                description="The sky’s the limit ... your Readers will simply log as much as they can. Perfect for contests, read-a-thons and groups that do not need a pre-determined goal."
                isSelected={
                  selection === StepOneProgramTypeSelection.READING_LOG
                }
                onClick={() => {
                  this.setState({
                    selection: StepOneProgramTypeSelection.READING_LOG,
                  });
                }}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    );
  }

  renderPart3() {
    const { readingLogSelection } = this.state;
    return (
      <>
        <Grid doubling columns="2">
          <Grid.Row>
            <Grid.Column>
              <DescriptionBlock
                icon={<OpenBook height={50} />}
                iconActive={<OpenBookActive height={50} />}
                title="Promote Reading"
                description="For the love of Reading!  Allow readers to log all their reading for the duration of this reading goal."
                isSelected={
                  readingLogSelection ===
                  StepOneProgramTypeSelection.PROMOTE_READING
                }
                onClick={() => {
                  this.setState({
                    readingLogSelection:
                      StepOneProgramTypeSelection.PROMOTE_READING,
                  });
                }}
              />
            </Grid.Column>
            <Grid.Column>
              <DescriptionBlock
                icon={<Cup height={50} />}
                iconActive={<CupActive height={50} />}
                title="Hold a Contest"
                description="The race is on!  You can set up a competition between reading groups (like classrooms or grade levers).  Individual readers can compete against each other.  Everyone will see where they stand in real time.    "
                isSelected={
                  readingLogSelection ===
                  StepOneProgramTypeSelection.HOLD_CONTEST
                }
                onClick={() => {
                  this.setState({
                    readingLogSelection:
                      StepOneProgramTypeSelection.HOLD_CONTEST,
                  });
                }}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    );
  }

  renderButtons() {
    const { classes } = this.props;
    const { programName, progress } = this.state;
    const isPartOne = progress === StepOneProgress.PART1;
    return (
      <>
        <Grid className={classes.buttonWrapper}>
          <Grid.Row columns="equal">
            <Grid.Column>
              <Button
                colorVariant={isPartOne ? ButtonColor.DANGER : ButtonColor.MAIN}
                buttonType={ButtonType.ROUND}
                icon={
                  isPartOne ? <Icon name="ban" /> : <Icon name="arrow left" />
                }
                classes={{ button: classes.cancelButton }}
                buttonProps={{
                  onClick: this.onBackPress,
                }}>
                {isPartOne ? 'Cancel' : 'Back'}
              </Button>
            </Grid.Column>
            <Grid.Column>
              <Button
                colorVariant={ButtonColor.SECONDARY}
                buttonType={ButtonType.ROUND}
                icon={<Icon name="arrow right" />}
                buttonProps={{
                  onClick: this.onNextPress,
                  disabled: !programName,
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
    const { progress } = this.state;
    return (
      <div className={classes.step}>
        {progress === StepOneProgress.PART1 && this.renderPart1()}
        {progress === StepOneProgress.PART2 && this.renderPart2()}
        {progress === StepOneProgress.PART3 && this.renderPart3()}
        {this.renderButtons()}
      </div>
    );
  }
}

export default themr<Props>('Step1', styles)(Step1);
