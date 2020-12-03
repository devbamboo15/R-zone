import * as React from 'react';
import Modal from 'src/components/Modal';
import WizardSteps from 'src/components/WizardSteps';
import BookPlus from 'src/assets/icons/book_plus.svg';
import UserWithHand from 'src/assets/icons/users_with_hands.svg';
import BookWithTarget from 'src/assets/icons/book_with_target.svg';
import TargetWithSettings from 'src/assets/icons/target_with_settings.svg';
import OpenBookSolid from 'src/assets/icons/open_book_solid.svg';
import * as moment from 'moment';
import { Metric } from 'src/store/types';
import urls from 'src/helpers/urls';
import { IProgram } from 'src/store/types/organizer/program';
import idx from 'idx';
import SignUpQuestionSelectorStep from 'src/screens/Programs/CreateModalSteps/SignUpQuestionSelectorStep';
import { ISignUpQuestion } from 'src/store/types/organizer/questions';
import AddReadingGroupStep from '../CreateModalSteps/AddReadingGroupStep';
import GroupMetricStep from '../CreateModalSteps/GroupMetricStep';
import GroupSettings from '../CreateModalSteps/GroupSettings';
import DateRangeStep from '../CreateModalSteps/DateRangeStep';
import GroupBookBankStep from '../CreateModalSteps/GroupBookBankStep';

export type Props = IScreenProps & {
  program: IProgram;
  // reading group name
  readingGroup: string;
  setReadingGroup: (value: string) => any;
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
  createCombinedGroup: Function;
  createGroupInProgress: boolean;
  createGroupSuccess: boolean | null;
  // signup questions
  signupQuestions: ISignUpQuestion[];
  groupQuestions: ISignUpQuestion[];
  setGroupQuestions: Function;
};

class CreateGroup extends React.Component<Props> {
  componentDidUpdate(prevProps: Props) {
    if (this.props.createGroupInProgress !== prevProps.createGroupInProgress) {
      if (
        prevProps.createGroupInProgress === true &&
        this.props.createGroupSuccess === true
      ) {
        this.props.history.push(
          urls.GROUPS({ programId: idx(this.props, x => x.program.id) })
        );
      }
    }
  }

  onSubmit = (books = []) => {
    const {
      readingGroup,
      goalDates,
      goalSettingsData,
      groupMetric,
      createCombinedGroup,
      program,
      groupQuestions,
    } = this.props;
    const selectedBooks = books;
    const isReadingLog = idx(program, x => x.attributes.reading_log);

    let data: any = {
      group: {
        name: readingGroup,
        questions: groupQuestions,
      },
      goal: {
        start_date: moment(goalDates.startDate).format('YYYY-MM-DD'),
        end_date: moment(goalDates.endDate).format('YYYY-MM-DD'),
        value: !isReadingLog ? `${goalSettingsData.amount}` : 0,
        metric_id: groupMetric,
        interval_id: !isReadingLog ? goalSettingsData.interval : null,
      },
    };
    if (selectedBooks.length > 0) {
      data = {
        ...data,
        book: selectedBooks,
      };
    }
    createCombinedGroup(program.id, data);
  };

  getSteps() {
    const {
      setReadingGroup,
      readingGroup,
      groupMetric,
      setGroupMetric,
      setGoalSettingsData,
      goalSettingsData,
      goalDates,
      setGoalDates,
      createGroupInProgress,
      history,
      program,
      groupQuestions,
      setGroupQuestions,
      signupQuestions,
    } = this.props;
    const isReadingLog = idx(program, x => x.attributes.reading_log);

    const steps = [
      {
        title: 'Add a Reading Group',
        component: (
          <AddReadingGroupStep
            initialGroupName={readingGroup}
            onNext={setReadingGroup}
            isFirstStep
            onCancel={() => {
              history.goBack();
            }}
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
            inProgress={createGroupInProgress}
            onNext={this.onSubmit}
          />
        ),
        icon: <OpenBookSolid height={80} />,
      },
    ];
    if (isReadingLog) {
      steps.splice(2, 1);
    }

    return steps;
  }

  render() {
    const { classes, program } = this.props;
    const restSteps = this.getSteps();
    return (
      <Modal
        modelProps={{
          open: true,
          closeIcon: true,
          className: classes.modal,
          size: 'small',
          onClose: () => {
            this.props.history.push(urls.GROUPS({ programId: program.id }));
          },
        }}
        contentProps={{ className: classes.modalContent }}>
        <WizardSteps steps={restSteps} />
      </Modal>
    );
  }
}

export default CreateGroup;
