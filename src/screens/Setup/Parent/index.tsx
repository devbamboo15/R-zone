import * as React from 'react';
import themr from 'src/helpers/themr';
import { get } from 'lodash';
import Step, { IStep } from '../components/Step';
import NewReader from '../components/NewReader';
import ReaderInput from '../components/ReaderInput';
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
  childDetailsDataLoading: boolean;
  programsLoading: boolean;
  createReadingEntryLoading: boolean;
  readerOptions: any[];
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
  childActiveGroupIds: any[];
  programs: any[];
  role: string;
};

const Parent = props => {
  const {
    formProps,
    childDetailsDataLoading,
    programsLoading,
    createReadingEntryLoading,
    readerOptions,
    programOptions,
    groupOptions,
    metricId,
    booksReadingLoading,
    handleSearchBook,
    searchedBooks,
    onNewBook,
    bookOptions,
    selectedProgram,
    newGroupOptions,
    userFinishBooksLoading,
    userAddBooksLoading,
    childActiveGroupIds,
    programs,
    role,
  } = props;
  const [step, setStep] = React.useState(1);
  const readerInputProps = {
    readerOptions,
    formProps,
    setStep,
    onChange: value => {
      if (value !== 'new' && step >= 2) {
        setStep(2);
      }
    },
  };
  const programInputProps = {
    programOptions,
    formProps,
    onChange: programVal => {
      if (programVal === 'new') {
        setStep(2);
      } else if (step > 3) {
        setStep(3);
      }
    },
  };
  const groupInputProps = {
    groupOptions,
    formProps,
    onChange: (selectedMetricId, val) => {
      if (selectedMetricId !== 'books' && step === 5) {
        setStep(4);
      }
      if (val === 'new') {
        setStep(3);
      }
    },
    selectedProgram,
  };
  const metricInputProps = { formProps, metricId };
  const bookInputProps = { bookOptions, formProps };
  const stepMapping = {
    1: 'reader',
    2: 'program',
    3: 'group',
    4: metricId === 'yes/no' ? 'yesNo' : 'metric',
  };
  const selGroupId = get(formProps, 'values.group', '');
  const selGroup = groupOptions.find(x => x.value === selGroupId);
  const selGroupTitle = get(selGroup, 'text', '');
  const stepData: IStep[] = [
    {
      label: (
        <>
          1) <b>Choose</b> or <b>Create</b> a reader:
        </>
      ),
      newValueStep: (
        <NewReader
          onFinishCb={() => {
            setStep(4);
          }}
          parentFormProps={formProps}
        />
      ),
      loading: programsLoading,
      input: <ReaderInput {...readerInputProps} />,
    },
    {
      label: (
        <>
          2) <b>Select</b> a reading program to make a reading entry, or
          <b>Join</b> a new reading program:
        </>
      ),
      input: <ProgramInput {...programInputProps} />,
      newValueStep: (
        <NewProgram
          role={role}
          onFinishCb={() => {
            setStep(3);
          }}
          step={step}
          programs={programs}
          parentFormProps={formProps}
          childActiveGroupIds={childActiveGroupIds}
        />
      ),
    },
    {
      label: (
        <>
          3) <b>Select</b> a reading group to make an entry, or <b>Join</b> a
          new
          <br />
          reading group:
        </>
      ),
      input: <GroupInput {...groupInputProps} />,
      newValueStep: (
        <NewGroup
          role={role}
          onFinishCb={() => {
            setStep(3);
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
          4){' '}
          {metricId === 'yes/no'
            ? yesNoMetricLabel(selGroupTitle)
            : metricLabel(metricId)}
        </>
      ),
      input: <MetricInput {...metricInputProps} />,
    },
  ];
  if (metricId === 'books') {
    stepMapping[5] = 'book';
    stepData.push({
      label: (
        <>
          5) <b>Select</b> the <b>Book(s)</b> you have read from your book bank
          or <b>Add</b> a new book to your book bank:
        </>
      ),
      newValueStep: (
        <NewBook
          onSubmit={onNewBook}
          handleSearchBook={handleSearchBook}
          searchedBooks={searchedBooks}
          stepLength={5}
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
        childDetailsDataLoading ||
        createReadingEntryLoading ||
        booksReadingLoading ||
        userFinishBooksLoading
      }
    />
  );
};

export default themr<Props>('Parent', styles)(Parent);
