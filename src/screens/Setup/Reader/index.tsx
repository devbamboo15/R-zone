import * as React from 'react';
import themr from 'src/helpers/themr';
import { get } from 'lodash';
import Step, { IStep } from '../components/Step';
import ProgramInput from '../components/ProgramInput';
import GroupInput from '../components/GroupInput';
import MetricInput, {
  yesNoMetricLabel,
  metricLabel,
} from '../components/MetricInput';
import BookInput from '../components/BookInput';
import NewBook from '../components/NewBook';
import NewProgram from '../components/NewProgram';
import NewGroup from '../components/NewGroup';
import styles from '../styles.scss';

export type Props = IComponentProps & {
  formProps: any;
  createReadingEntryLoading: boolean;
  programOptions: any[];
  groupOptions: any[];
  metricId: any;
  handleSearchBook: Function;
  searchedBooks: any[];
  onNewBook: Function;
  booksReadingLoading: boolean;
  bookOptions: any[];
  selectedProgram: any;
  newGroupOptions: any[];
  userFinishBooksLoading: boolean;
  userAddBooksLoading: boolean;
  programs: any[];
  childActiveGroupIds: any[];
  role: string;
};

const Reader = props => {
  const {
    formProps,
    createReadingEntryLoading,
    programOptions,
    groupOptions,
    metricId,
    bookOptions,
    booksReadingLoading,
    handleSearchBook,
    searchedBooks,
    onNewBook,
    selectedProgram,
    newGroupOptions,
    userFinishBooksLoading,
    userAddBooksLoading,
    programs,
    childActiveGroupIds,
    role,
  } = props;
  const [step, setStep] = React.useState(1);
  const programInputProps = {
    programOptions,
    formProps,
    onChange: programVal => {
      if (programVal === 'new') {
        setStep(1);
      } else if (step > 2) {
        setStep(2);
      }
    },
  };
  const groupInputProps = {
    groupOptions,
    formProps,
    onChange: (selectedMetricId, val) => {
      if (selectedMetricId !== 'books' && step === 4) {
        setStep(3);
      }
      if (val === 'new') {
        setStep(2);
      }
    },
    selectedProgram,
  };
  const metricInputProps = { formProps, metricId };
  const bookInputProps = { bookOptions, formProps };
  const stepMapping = {
    1: 'program',
    2: 'group',
    3: metricId === 'yes/no' ? 'yesNo' : 'metric',
  };
  const selGroupId = get(formProps, 'values.group', '');
  const selGroup = groupOptions.find(x => x.value === selGroupId);
  const selGroupTitle = get(selGroup, 'text', '');
  const stepData: IStep[] = [
    {
      label: (
        <>
          1) <b>Select</b> the program for which you want to make a reading
          entry, or <b>Join</b> a new reading program:
        </>
      ),
      input: <ProgramInput {...programInputProps} />,
      newValueStep: (
        <NewProgram
          onFinishCb={() => {
            setStep(2);
          }}
          step={step}
          programs={programs}
          parentFormProps={formProps}
          childActiveGroupIds={childActiveGroupIds}
          role={role}
        />
      ),
    },
    {
      label: (
        <>
          2) <b>Select</b> a reading group to make an entry, or <b>Join</b> a
          new reading group:
        </>
      ),
      input: <GroupInput {...groupInputProps} />,
      newValueStep: (
        <NewGroup
          role={role}
          onFinishCb={() => {
            setStep(2);
          }}
          step={step}
          programs={programs}
          parentFormProps={formProps}
          groupOptions={newGroupOptions}
        />
      ),
    },
    {
      label: (
        <>
          3){' '}
          {metricId === 'yes/no'
            ? yesNoMetricLabel(selGroupTitle)
            : metricLabel(metricId)}
        </>
      ),
      input: <MetricInput {...metricInputProps} />,
    },
  ];
  if (metricId === 'books') {
    stepMapping[4] = 'book';
    stepData.push({
      label: (
        <>
          4) <b>Select</b> the <b>Book(s)</b> you have read from your book bank
          or <b>Add</b> a new book to your book bank:
        </>
      ),
      newValueStep: (
        <NewBook
          onSubmit={onNewBook}
          handleSearchBook={handleSearchBook}
          searchedBooks={searchedBooks}
          stepLength={4}
          buttonLoading={userAddBooksLoading}
        />
      ),
      input: (
        <>
          <BookInput {...bookInputProps} />
        </>
      ),
    });
  }

  return (
    <Step
      formProps={formProps}
      stepMapping={stepMapping}
      stepData={stepData}
      step={step}
      setStep={setStep}
      buttonLoading={
        createReadingEntryLoading ||
        booksReadingLoading ||
        userFinishBooksLoading
      }
    />
  );
};

export default themr<Props>('Reader', styles)(Reader);
