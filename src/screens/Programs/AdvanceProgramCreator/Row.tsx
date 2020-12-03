import * as React from 'react';
import idx from 'idx';
import findIndex from 'lodash/findIndex';
import clone from 'lodash/clone';
import get from 'lodash/get';
import { Grid } from 'semantic-ui-react';
import themr from 'src/helpers/themr';
import Checkbox from 'src/components/FormFields/Checkbox';
import Input from 'src/components/FormFields/Input';
import Select from 'src/components/FormFields/Select';
import Button, { ButtonColor } from 'src/components/Button';
import DateRangePicker from 'src/components/DateRangePicker';
import * as moment from 'moment';
import AddBooksModal from 'src/components/Modal/AddBooksModal';
import { IBookItem } from 'src/store/types';
import GroupBookBankModal from 'src/components/Modal/GroupBookBankModal';
import GroupQuestionChooserModal from 'src/components/Modal/GroupQuestionChooserModal';
import GroupBankButtonIcon from 'src/assets/icons/GroupBankButtonIcon.svg';
import { ISignUpQuestion } from 'src/store/types/organizer/questions';
import styles from './styles.scss';

export type Props = IComponentProps & {
  data?: any;
  updateData: Function;
  errors?: any;
  touched?: any;
  isReadingLog: boolean;
  isHeaderRow?: boolean;
  readonly?: boolean;
  touchedAll?: boolean;
  questionList: ISignUpQuestion[];
  userAccessProgram: any;
  programId: string;
};

class AdvanceProgramCreatorRow extends React.Component<Props> {
  state = {
    addBookModalOpen: false,
    groupBookBankModalOpen: false,
    groupQuestionChooserModalOpen: false,
  };

  toggleAddBookModal = () => {
    const { addBookModalOpen } = this.state;
    this.setState({
      addBookModalOpen: !addBookModalOpen,
    });
  };

  toggleGroupBookBankModal = () => {
    const { groupBookBankModalOpen } = this.state;
    this.setState({
      groupBookBankModalOpen: !groupBookBankModalOpen,
    });
  };

  toggleGroupQuestionChooserModal = () => {
    const { groupQuestionChooserModalOpen } = this.state;
    this.setState({
      groupQuestionChooserModalOpen: !groupQuestionChooserModalOpen,
    });
  };

  onSelectBook = (book: IBookItem) => {
    const { data = {}, updateData } = this.props;
    const books = get(data, 'books', []) || [];
    const newBooks = clone(books);
    const pos = findIndex(books, { id: book.id });
    if (pos > -1) {
      newBooks.splice(pos, 1);
    } else {
      newBooks.push(book);
    }
    updateData('books', newBooks);
  };

  render() {
    const {
      data = {},
      updateData,
      errors = {},
      touched = {},
      isReadingLog,
      isHeaderRow,
      classes,
      readonly,
      touchedAll,
      questionList,
      programId,
      userAccessProgram,
    } = this.props;

    const name = idx(data, x => x.attributes.name) || '';
    const metric = idx(data, x => x.goal.attributes.metric_id) || '';
    const goalValue = idx(data, x => x.goal.attributes.value) || '';
    const interval = idx(data, x => x.goal.attributes.interval_id) || '';
    const startDate = idx(data, x => x.goal.attributes.start_date) || '';
    const endDate = idx(data, x => x.goal.attributes.end_date) || '';
    const questions = idx(data, x => x.attributes.questions) || [];
    const selected = idx(data, x => x.selected) || false;
    const books = get(data, 'books', []) || [];
    const groupId = get(data, 'id', undefined);
    let accessGroupByProgram = get(
      userAccessProgram,
      `group_by_program[${programId}][${groupId}]`,
      {}
    );

    if (undefined === programId || undefined === groupId) {
      accessGroupByProgram = {
        write: true,
      };
    }

    return (
      <Grid.Row
        columns="equal"
        verticalAlign="middle"
        className={isHeaderRow ? classes.selectRow : ''}>
        <Grid.Column width={1} className={classes.checkboxWrapper}>
          {!isHeaderRow && (
            <Checkbox
              checkboxProps={{
                checked: Boolean(selected),
                onChange: (_, { checked }) => {
                  updateData('selected', checked);
                },
              }}
            />
          )}
        </Grid.Column>
        <Grid.Column width={2}>
          <Input
            inputProps={{
              placeholder: 'Group Name',
              value: name,
              onChange: (_, { value }) => {
                updateData('attributes.name', value);
              },
              disabled: readonly,
            }}
            highlight
            errorMessageOverlap
            errorMessage={
              (idx(touched, x => x.attributes.name) || touchedAll) &&
              idx(errors, x => x.attributes.name)
            }
          />
        </Grid.Column>
        <Grid.Column width={2}>
          <Select
            selectProps={{
              disabled: readonly,
              options: [
                {
                  text: 'Pages',
                  value: 'pages',
                },
                {
                  text: 'Books',
                  value: 'books',
                },
                {
                  text: 'Chapters',
                  value: 'chapters',
                },
                {
                  text: 'Minutes',
                  value: 'minutes',
                },
                {
                  text: 'Yes/No',
                  value: 'yes/no',
                },
              ],
              placeholder: 'Metric',
              onChange: (_, { value }) => {
                updateData('goal.attributes.metric_id', value);
              },
              value: String(metric),
            }}
            highlight
            errorMessageOverlap
            errorMessage={
              (idx(touched, x => x.goal.attributes.metric_id) || touchedAll) &&
              idx(errors, x => x.goal.attributes.metric_id)
            }
          />
        </Grid.Column>
        {!isReadingLog && (
          <Grid.Column width={1}>
            <Input
              inputProps={{
                disabled: readonly,
                placeholder: 'Value',
                value: goalValue,
                onChange: (_, { value }) => {
                  updateData('goal.attributes.value', value);
                },
              }}
              highlight
              errorMessageOverlap
              errorMessage={
                (idx(touched, x => x.goal.attributes.value) || touchedAll) &&
                idx(errors, x => x.goal.attributes.value)
              }
            />
          </Grid.Column>
        )}
        {!isReadingLog && (
          <Grid.Column width={2}>
            <Select
              selectProps={{
                disabled: readonly,
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
                placeholder: 'Frequency',
                onChange: (_, { value }) => {
                  updateData('goal.attributes.interval_id', value);
                },
                value: String(interval),
              }}
              highlight
              errorMessageOverlap
              errorMessage={
                (idx(touched, x => x.goal.attributes.interval_id) ||
                  touchedAll) &&
                idx(errors, x => x.goal.attributes.interval_id)
              }
            />
          </Grid.Column>
        )}
        <Grid.Column width={4}>
          <DateRangePicker
            readonly={readonly}
            startDate={startDate ? moment(String(startDate)) : null}
            endDate={endDate ? moment(String(endDate)) : null}
            onDatesChange={d => {
              if (d.startDate) {
                updateData(
                  'goal.attributes.start_date',
                  moment(d.startDate).format('YYYY-MM-DD')
                );
              }
              if (d.endDate) {
                updateData(
                  'goal.attributes.end_date',
                  moment(d.endDate).format('YYYY-MM-DD')
                );
              }
            }}
            startDateErrorMessage={
              (idx(touched, x => x.goal.attributes.start_date) || touchedAll) &&
              idx(errors, x => x.goal.attributes.start_date)
            }
            endDateErrorMessage={
              (idx(touched, x => x.goal.attributes.end_date) || touchedAll) &&
              idx(errors, x => x.goal.attributes.end_date)
            }
          />
        </Grid.Column>
        <Grid.Column width={2} className={classes.bookBankButton}>
          <Button
            colorVariant={ButtonColor.MAIN}
            buttonProps={{
              type: 'button',
              onClick: this.toggleGroupBookBankModal,
            }}>
            <GroupBankButtonIcon />[{books.length}] Books
          </Button>
        </Grid.Column>
        <Grid.Column width={2} className={classes.chooseQuestionsButton}>
          <Button
            colorVariant={ButtonColor.MAIN}
            buttonProps={{
              type: 'button',
              onClick: this.toggleGroupQuestionChooserModal,
            }}>
            [{questions.length}] Questions
          </Button>
        </Grid.Column>
        <GroupBookBankModal
          modelProps={{
            size: 'small',
            open: this.state.groupBookBankModalOpen,
            onClose: this.toggleGroupBookBankModal,
            closeIcon: true,
          }}
          accessGroupByProgram={accessGroupByProgram}
          books={books}
          onAddBookClicked={this.toggleAddBookModal}
          onRemoveBook={book => {
            // onSelectBook will automatically remove book because it is already selected
            this.onSelectBook(book);
          }}
        />
        <GroupQuestionChooserModal
          modelProps={{
            size: 'small',
            open: this.state.groupQuestionChooserModalOpen,
            onClose: this.toggleGroupQuestionChooserModal,
            closeIcon: true,
          }}
          questionList={questionList}
          questions={questions}
          onUpdateQuestions={qdata => {
            updateData('attributes.questions', qdata);
          }}
          onSave={() => {
            this.toggleGroupQuestionChooserModal();
          }}
        />
        <AddBooksModal
          modelProps={{
            size: 'small',
            open: this.state.addBookModalOpen,
            onClose: this.toggleAddBookModal,
            closeIcon: true,
          }}
          onSelectBook={book => {
            this.onSelectBook(book);
          }}
          selectedBooks={books}
        />
      </Grid.Row>
    );
  }
}

export default themr<Props>('AdvanceProgramCreatorRow', styles)(
  AdvanceProgramCreatorRow
);
