import * as React from 'react';
import { Redirect } from 'react-router-dom';
import Modal from 'src/components/Modal';
import WizardSteps from 'src/components/WizardSteps';
import BookPlus from 'src/assets/icons/book_plus.svg';
import UserWithHand from 'src/assets/icons/users_with_hands.svg';
import CupWithHand from 'src/assets/icons/cup_with_hand.svg';
import BookWithTarget from 'src/assets/icons/book_with_target.svg';
import TargetWithSettings from 'src/assets/icons/target_with_settings.svg';
import OpenBookSolid from 'src/assets/icons/open_book_solid.svg';
import idx from 'idx';
import * as moment from 'moment';
import { Metric } from 'src/store/types';
import urls from 'src/helpers/urls';
import { ISignUpQuestion } from 'src/store/types/organizer/questions';
import InitialStep, { InitialStepFlow } from '../CreateModalSteps/InitialStep';
import Step1, {
  StepOneProgress,
  StepOneProgramTypeSelection,
} from '../CreateModalSteps/Step1';
import AddReadingGroupStep from '../CreateModalSteps/AddReadingGroupStep';
import ContestTypeStep, {
  ContestType,
} from '../CreateModalSteps/ContestTypeStep';
import GroupMetricStep from '../CreateModalSteps/GroupMetricStep';
import GroupSettings from '../CreateModalSteps/GroupSettings';
import DateRangeStep from '../CreateModalSteps/DateRangeStep';
import GroupBookBankStep from '../CreateModalSteps/GroupBookBankStep';
import SignUpQuestionSelectorStep from '../CreateModalSteps/SignUpQuestionSelectorStep';

export type Props = IScreenProps & {
  initialStepFlow: number;
  setInitialStepFlow: Function;
  step1Data: {
    programName: string;
    progress: StepOneProgress;
    selection: StepOneProgramTypeSelection;
    readingLogSelection: StepOneProgramTypeSelection;
  };
  setStep1Data: Function;
  // reading group name
  readingGroup: string;
  setReadingGroup: (value: string) => any;
  // contest type
  contestType: ContestType;
  setContestType: Function;
  // group metric
  groupMetric: Metric;
  setGroupMetric: Function;
  // group setttings
  goalSettingsData: {
    amount: number;
    interval: string;
  };
  setGoalSettingsData: Function;
  // goal dates
  goalDates: {
    startDate: string;
    endDate: string;
  };
  setGoalDates: Function;
  // create program
  groupQuestions: ISignUpQuestion[];
  setGroupQuestions: Function;
  createProgram: Function;
  createProgramInProgress: boolean;
  createProgramSuccess: boolean | null;
  getNewProgramCode: Function;
  programCodeLoading: boolean;
  programCode: string;
  signupQuestions: ISignUpQuestion[];
};

class CreateProgram extends React.Component<Props> {
  componentDidUpdate(prevProps: Props) {
    if (
      this.props.createProgramInProgress !== prevProps.createProgramInProgress
    ) {
      if (
        prevProps.createProgramInProgress === true &&
        this.props.createProgramSuccess === true
      ) {
        this.props.getNewProgramCode();
        this.props.history.push(urls.PROGRAMS());
      }
    }
    const { programCodeLoading } = this.props;
    if (
      !programCodeLoading &&
      prevProps.programCodeLoading !== programCodeLoading
    ) {
      const step1Data = {
        ...this.props.step1Data,
        code: this.props.programCode,
      };
      this.props.setStep1Data(step1Data);
    }
  }

  onSubmit = (books = []) => {
    const {
      step1Data,
      readingGroup,
      goalDates,
      goalSettingsData,
      groupMetric,
      createProgram,
      contestType,
      programCode,
      groupQuestions,
    } = this.props;
    const selectedBooks = books;
    const selection = idx(step1Data, x => x.selection);
    const readingLogSelection = idx(step1Data, x => x.readingLogSelection);

    let readingLog = 0;
    if (selection === StepOneProgramTypeSelection.GOAL_BASED) {
      readingLog = 0;
    } else if (
      selection === StepOneProgramTypeSelection.READING_LOG &&
      readingLogSelection === StepOneProgramTypeSelection.PROMOTE_READING
    ) {
      readingLog = 1;
    } else if (
      selection === StepOneProgramTypeSelection.READING_LOG &&
      readingLogSelection === StepOneProgramTypeSelection.HOLD_CONTEST
    ) {
      if (contestType === ContestType.GROUP) {
        readingLog = 2;
      } else if (contestType === ContestType.READER) {
        readingLog = 3;
      }
    }

    let data: any = {
      program: {
        name: idx(step1Data, x => x.programName),
        reading_log: readingLog,
        code: programCode,
      },
      group: {
        name: readingGroup,
        questions: groupQuestions,
      },
      goal: {
        start_date: moment(goalDates.startDate).format('YYYY-MM-DD'),
        end_date: moment(goalDates.endDate).format('YYYY-MM-DD'),
        value: !readingLog ? `${goalSettingsData.amount}` : 0,
        metric_id: groupMetric,
        interval_id: !readingLog ? goalSettingsData.interval : null,
      },
    };
    if (selectedBooks.length > 0) {
      data = {
        ...data,
        book: selectedBooks,
      };
    }
    createProgram(data);
  };

  getSteps() {
    const {
      step1Data,
      setContestType,
      contestType,
      setReadingGroup,
      readingGroup,
      groupMetric,
      setGroupMetric,
      setGoalSettingsData,
      goalSettingsData,
      goalDates,
      setGoalDates,
      createProgramInProgress,
      groupQuestions,
      setGroupQuestions,
      signupQuestions,
    } = this.props;
    let steps = [];
    if (step1Data.selection === StepOneProgramTypeSelection.GOAL_BASED) {
      steps = [
        {
          title: 'Add Your First Reading Group',
          component: (
            <AddReadingGroupStep
              initialGroupName={readingGroup}
              onNext={setReadingGroup}
            />
          ),
          icon: <UserWithHand height={80} />,
        },
        {
          title: 'Define your Reading Goals',
          component: (
            <GroupMetricStep
              onNext={val => {
                setGroupMetric(val);
              }}
              initialMetric={groupMetric}
            />
          ),
          icon: <BookWithTarget height={80} />,
        },
        {
          title: 'Goal Settings',
          component: (
            <GroupSettings
              onNext={data => {
                setGoalSettingsData(data);
              }}
              metric={groupMetric}
              initialData={goalSettingsData}
            />
          ),
          icon: <TargetWithSettings height={80} />,
        },
        {
          title: 'Set your Date Range',
          component: (
            <DateRangeStep onNext={setGoalDates} initialData={goalDates} />
          ),
          icon: <BookPlus height={80} />,
        },
        {
          title: 'Additional Sign Up Questions (Optional)',
          component: (
            <SignUpQuestionSelectorStep
              questionList={signupQuestions}
              onNext={setGroupQuestions}
              initialData={groupQuestions}
            />
          ),
          icon: <BookPlus height={80} />,
        },
        {
          title: 'Group Book Bank (Optional)',
          component: (
            <GroupBookBankStep
              inProgress={createProgramInProgress}
              onNext={this.onSubmit}
            />
          ),
          icon: <OpenBookSolid height={80} />,
        },
      ];
    } else if (
      step1Data.readingLogSelection ===
      StepOneProgramTypeSelection.PROMOTE_READING
    ) {
      steps = [
        {
          title: 'Add Your First Reading Group',
          component: (
            <AddReadingGroupStep
              initialGroupName={readingGroup}
              onNext={setReadingGroup}
            />
          ),
          icon: <UserWithHand height={80} />,
        },
        {
          title: 'Choose what you’re Reading',
          component: (
            <GroupMetricStep
              onNext={val => {
                setGroupMetric(val);
              }}
              initialMetric={groupMetric}
              message="Pick a reading category that is challenging but attainable for your reading group. This choice can be changed or deleted anytime."
            />
          ),
          icon: <BookWithTarget height={80} />,
        },
        {
          title: 'Set your Date Range',
          component: (
            <DateRangeStep onNext={setGoalDates} initialData={goalDates} />
          ),
          icon: <BookPlus height={80} />,
        },
        {
          title: 'Additional Sign Up Questions (Optional)',
          component: (
            <SignUpQuestionSelectorStep
              questionList={signupQuestions}
              onNext={setGroupQuestions}
              initialData={groupQuestions}
            />
          ),
          icon: <BookPlus height={80} />,
        },
        {
          title: 'Group Book Bank (Optional)',
          component: (
            <GroupBookBankStep
              inProgress={createProgramInProgress}
              onNext={this.onSubmit}
            />
          ),
          icon: <OpenBookSolid height={80} />,
        },
      ];
    } else if (
      step1Data.readingLogSelection === StepOneProgramTypeSelection.HOLD_CONTEST
    ) {
      steps = [
        {
          title: 'Choose your Contest Type',
          component: (
            <ContestTypeStep
              onChangeContestType={value => {
                setContestType(value);
              }}
              initialValue={contestType}
            />
          ),
          icon: <CupWithHand height={80} />,
        },
        // Dummy steps
        {
          title: '',
          component: null,
        },
        {
          title: '',
          component: null,
        },
        {
          title: '',
          component: null,
        },
        {
          title: '',
          component: null,
        },
      ];
      if (contestType === ContestType.READER) {
        steps = [
          steps[0],
          {
            title: 'Add your first Reading Group',
            component: (
              <AddReadingGroupStep
                initialGroupName={readingGroup}
                onNext={setReadingGroup}
                message={
                  <div>
                    You can create the rest of your groups for your contest as
                    soon as you are done with this initial setup. To create more
                    groups quickly, use the Advanced Editor to copy this one to
                    rapidly create all your groups with the same settings.
                  </div>
                }
              />
            ),
            icon: <UserWithHand height={80} />,
          },
          {
            title: 'Define your Group Contest’s Goal',
            component: (
              <GroupMetricStep
                onNext={val => {
                  setGroupMetric(val);
                }}
                initialMetric={groupMetric}
              />
            ),
            icon: <BookPlus height={80} />,
          },
          {
            title: 'Set your Date Range',
            component: (
              <DateRangeStep onNext={setGoalDates} initialData={goalDates} />
            ),
            icon: <BookPlus height={80} />,
          },
          {
            title: 'Additional Sign Up Questions (Optional)',
            component: (
              <SignUpQuestionSelectorStep
                questionList={signupQuestions}
                onNext={setGroupQuestions}
                initialData={groupQuestions}
              />
            ),
            icon: <BookPlus height={80} />,
          },
          {
            title: 'Group Book Bank (Optional)',
            component: (
              <GroupBookBankStep
                inProgress={createProgramInProgress}
                onNext={this.onSubmit}
              />
            ),
            icon: <OpenBookSolid height={80} />,
          },
        ];
      } else if (contestType === ContestType.GROUP) {
        steps = [
          steps[0],
          {
            title: 'Define your Group Contest’s Goal',
            component: (
              <GroupMetricStep
                onNext={val => {
                  setGroupMetric(val);
                }}
                initialMetric={groupMetric}
              />
            ),
            icon: <BookPlus height={80} />,
          },
          {
            title: 'Add your first Reading Group',
            component: (
              <AddReadingGroupStep
                initialGroupName={readingGroup}
                onNext={setReadingGroup}
                message={
                  <div>
                    You can create the rest of your groups for your contest as
                    soon as you are done with this initial setup. To create more
                    groups quickly, use the Advanced Editor to copy this one to
                    rapidly create all your groups with the same settings.
                  </div>
                }
              />
            ),
            icon: <UserWithHand height={80} />,
          },
          {
            title: 'Set your Date Range',
            component: (
              <DateRangeStep onNext={setGoalDates} initialData={goalDates} />
            ),
            icon: <BookPlus height={80} />,
          },
          {
            title: 'Additional Sign Up Questions (Optional)',
            component: (
              <SignUpQuestionSelectorStep
                questionList={signupQuestions}
                onNext={setGroupQuestions}
                initialData={groupQuestions}
              />
            ),
            icon: <BookPlus height={80} />,
          },
          {
            title: 'Group Book Bank(Optional)',
            component: (
              <GroupBookBankStep
                inProgress={createProgramInProgress}
                onNext={this.onSubmit}
              />
            ),
            icon: <OpenBookSolid height={80} />,
          },
        ];
      }
    } else {
      steps = [
        {
          title: '',
          component: null,
        },
        {
          title: '',
          component: null,
        },
        {
          title: '',
          component: null,
        },
        {
          title: '',
          component: null,
        },
        {
          title: '',
          component: null,
        },
      ];
    }
    return steps;
  }

  renderIntialStep() {
    const { setInitialStepFlow, initialStepFlow } = this.props;
    if (
      initialStepFlow !== InitialStepFlow.QUICK_START &&
      initialStepFlow !== InitialStepFlow.ADVANCED
    ) {
      return (
        <InitialStep
          onSelectFlow={(flow: InitialStepFlow) => {
            setInitialStepFlow(flow);
          }}
        />
      );
    }
    return null;
  }

  render() {
    const {
      classes,
      initialStepFlow,
      setInitialStepFlow,
      setStep1Data,
      step1Data,
      programCode,
    } = this.props;
    const restSteps = this.getSteps();
    const newStep1Data = { ...step1Data, code: programCode };
    return (
      !!programCode && (
        <Modal
          modelProps={{
            closeOnDimmerClick: false,
            open: true,
            closeIcon: true,
            className: classes.modal,
            size: 'small',
            onClose: () => {
              this.props.history.push(urls.PROGRAMS());
            },
          }}
          contentProps={{ className: classes.modalContent }}>
          {!!programCode && this.renderIntialStep()}
          {initialStepFlow === InitialStepFlow.QUICK_START && !!programCode && (
            <WizardSteps
              steps={[
                {
                  title:
                    step1Data.progress === -1 ||
                    step1Data.progress === StepOneProgress.PART1
                      ? 'Create a Program'
                      : 'Choose your Program Type',
                  component: (
                    <Step1
                      onCancel={() => {
                        // reset to initial step
                        setInitialStepFlow(-1);
                      }}
                      onNext={data => {
                        setStep1Data(data);
                      }}
                      initialData={newStep1Data}
                    />
                  ),
                  icon: <BookPlus height={80} />,
                },
                ...restSteps,
              ]}
            />
          )}
          {initialStepFlow === InitialStepFlow.ADVANCED && (
            <Redirect to={urls.CREATE_PROGRAM_ADVANCED({})} />
          )}
        </Modal>
      )
    );
  }
}

export default CreateProgram;
