import * as React from 'react';
import get from 'lodash/get';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import { Form, Container } from 'semantic-ui-react';
import * as H from 'history';
import cx from 'classnames';
import { Formik } from 'formik';
import * as queryString from 'query-string';
import * as moment from 'moment';
import urls from 'src/helpers/urls';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import LogoutBtnSvg from 'src/assets/icons/LogoutBtn.svg';
import debounce from 'lodash/debounce';
import Parent from './Parent';
import Reader from './Reader';
import Success from './Success';
import { getOptionData, isNotEndGroup } from './utils';
import { yupValidate } from './yupValidate';
import Loading from './components/Loading';

export type SetupProps = IComponentProps & {
  history: H.History;
  match: any;
  meData: any;
  doLogout: Function;
  getMeChild: Function;
  createReadingEntry: Function;
  childData: any[];
  childDataLoading: boolean;
  childDetailsDataLoading: boolean;
  getMeProgram: Function;
  getBooksReading: Function;
  mePrograms: any[];
  childPrograms: [];
  programsLoading: boolean;
  createReadingEntryLoading: boolean;
  booksReadingLoading: boolean;
  booksReading: any[];
  currentUserId: string;
  searchBooks: Function;
  resetSearchBooks: Function;
  books: any[];
  searchProgramGroups: any[];
  finishUserBooks: Function;
  userFinishBooksLoading: boolean;
  addBooks: Function;
  userAddBooksLoading: boolean;
  childActiveGroupIds: any[];
  setLastEntryData: Function;
};

class Setup extends React.Component<SetupProps> {
  form: any;

  componentDidMount() {
    this.onInit();
  }

  onInit = () => {
    const { getMeChild, getMeProgram, getBooksReading } = this.props;
    const role = this.getRole();
    if (role === 'parent') {
      getMeChild();
    } else {
      getBooksReading();
      getMeProgram({
        include: 'groups',
      });
    }
  };

  getRole = () => {
    const { match } = this.props;
    return get(match, 'params.role', '');
  };

  isReader = () => {
    const role = this.getRole();
    return role === 'reader';
  };

  addEntry = values => {
    const { createReadingEntry, history, setLastEntryData } = this.props;
    const data = {
      date: moment(new Date()).format('YYYY-MM-DD'),
      value:
        values.metricId === 'yes/no'
          ? values.yesNo
            ? 1
            : 0
          : Number(values.metric),
    };
    createReadingEntry(
      values.reader,
      values.goalId,
      data,
      () => {
        setLastEntryData(values);
        history.push(`${get(history, 'location.pathname')}?status=success`);
      },
      true
    );
  };

  handleSearchBook = debounce((searchText: string) => {
    const { searchBooks, resetSearchBooks } = this.props;
    if (searchText) {
      searchBooks(searchText);
    } else {
      resetSearchBooks();
    }
  }, 300);

  handleNewBook = values => {
    const { addBooks, getBooksReading } = this.props;
    const books = values.book.map(b => b.bookObj) || [];
    const readerId = this.isReader()
      ? null
      : get(this.form, 'state.values.reader', '');
    addBooks(
      {
        id: values.book.map(b => b.value) || [],
        group_id: get(this.form, 'state.values.group', ''),
      },
      books,
      readerId,
      () => {
        getBooksReading(readerId);
        this.form.setFieldValue('book', '');
      }
    );
  };

  handleSubmit = values => {
    const { finishUserBooks } = this.props;
    if (values.metricId === 'books') {
      const bookIds = values.book.map(b => b.value);
      finishUserBooks(
        bookIds,
        values.group,
        this.isReader() ? null : values.reader,
        () => {
          this.addEntry(values);
        }
      );
    } else {
      this.addEntry(values);
    }
  };

  render() {
    const {
      classes,
      meData,
      doLogout,
      childData,
      childDataLoading,
      childDetailsDataLoading,
      mePrograms,
      childPrograms,
      programsLoading,
      createReadingEntryLoading,
      currentUserId,
      history,
      booksReadingLoading,
      booksReading,
      books,
      searchProgramGroups,
      userFinishBooksLoading,
      userAddBooksLoading,
      childActiveGroupIds,
    } = this.props;
    const role = this.getRole();
    const params = queryString.parse(history.location.search);
    const statusParam = get(params, 'status');
    const isSuccess = statusParam === 'success';
    const programs = role === 'reader' ? mePrograms : childPrograms;
    return (
      <div className={cx(classes.setupPage, isSuccess && classes.success)}>
        <Container fluid>
          {isSuccess ? (
            <section>
              <Success doLogout={doLogout} onMakeAnother={this.onInit} />
            </section>
          ) : (
            <section className={classes.setupInner}>
              <h2>Welcome To Reader Zone, {meData.first_name}!</h2>
              <div className={classes.logoutSection}>
                <Button
                  colorVariant={ButtonColor.DANGER}
                  buttonType={ButtonType.ROUND}
                  icon={<LogoutBtnSvg height={20} />}
                  btnClass={classes.logoutSectionBtn}
                  buttonProps={{
                    onClick: () => {
                      localStorage.setItem('notRedirect', 'true');
                      doLogout();
                      window.location.href = urls.SITE_HOMEPAGE;
                    },
                  }}>
                  Logout
                </Button>
              </div>
              <div className={cx(classes.formPanel)}>
                {(childDataLoading ||
                  programsLoading ||
                  childDetailsDataLoading ||
                  booksReadingLoading) && <Loading />}
                <Formik
                  onSubmit={this.handleSubmit}
                  ref={ref => (this.form = ref)}
                  initialValues={{
                    role,
                    reader: this.isReader() ? currentUserId : '',
                    program: '',
                    group: '',
                    metric: '',
                    metricId: '',
                    book: '',
                  }}
                  validationSchema={yupValidate}>
                  {formProps => {
                    const { values } = formProps;
                    const optionData = getOptionData(
                      values,
                      childData,
                      programs,
                      booksReading
                    );
                    const remainGroups = searchProgramGroups.filter(g =>
                      isEmpty(
                        find(get(optionData, 'selectedProgram.groups') || [], {
                          id: g.id,
                        }) || {}
                      )
                    );
                    const newGroupOptions = remainGroups
                      .filter(
                        g =>
                          isNotEndGroup(g) &&
                          !childActiveGroupIds.includes(g.id.toString())
                      )
                      .map(g => {
                        return {
                          value: g.id.toString(),
                          label: get(g, 'attributes.name', ''),
                          metricId: get(g, 'attributes.active_metric_id', ''),
                          goalId: get(g, 'attributes.active_goal_id', ''),
                        };
                      });
                    const { allBookIds } = optionData;
                    const searchedBooks =
                      books.filter(b => !allBookIds.includes(b.id)) || [];
                    return (
                      <Form
                        onSubmit={formProps.handleSubmit}
                        className={classes.mainForm}>
                        <div className={classes.formInner}>
                          {role === 'parent' ? (
                            <Parent
                              formProps={formProps}
                              childDetailsDataLoading={childDetailsDataLoading}
                              programsLoading={programsLoading}
                              createReadingEntryLoading={
                                createReadingEntryLoading
                              }
                              readerOptions={optionData.readerOptions}
                              programOptions={optionData.programOptions}
                              groupOptions={optionData.groupOptions}
                              metricId={values.metricId}
                              bookOptions={optionData.bookOptions}
                              booksReadingLoading={booksReadingLoading}
                              handleSearchBook={this.handleSearchBook}
                              searchedBooks={searchedBooks}
                              onNewBook={this.handleNewBook}
                              selectedProgram={optionData.selectedProgram}
                              newGroupOptions={newGroupOptions}
                              userFinishBooksLoading={userFinishBooksLoading}
                              userAddBooksLoading={userAddBooksLoading}
                              childActiveGroupIds={childActiveGroupIds}
                              programs={programs}
                              role={role}
                            />
                          ) : (
                            <Reader
                              formProps={formProps}
                              createReadingEntryLoading={
                                createReadingEntryLoading
                              }
                              programOptions={optionData.programOptions}
                              groupOptions={optionData.groupOptions}
                              metricId={values.metricId}
                              bookOptions={optionData.bookOptions}
                              booksReadingLoading={booksReadingLoading}
                              handleSearchBook={this.handleSearchBook}
                              searchedBooks={searchedBooks}
                              onNewBook={this.handleNewBook}
                              selectedProgram={optionData.selectedProgram}
                              newGroupOptions={newGroupOptions}
                              userFinishBooksLoading={userFinishBooksLoading}
                              userAddBooksLoading={userAddBooksLoading}
                              childActiveGroupIds={childActiveGroupIds}
                              programs={programs}
                              role={role}
                            />
                          )}
                        </div>
                      </Form>
                    );
                  }}
                </Formik>
              </div>
            </section>
          )}
        </Container>
      </div>
    );
  }
}

export default Setup;
