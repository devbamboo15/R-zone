import * as React from 'react';
import themr from 'src/helpers/themr';
import cn from 'classnames';
import Button, { ButtonType } from 'src/components/Button';
import PlusWithoutCircleSvg from 'src/assets/icons/plusWithoutCircle.svg';
import ReSelect from 'src/components/ReSelect';
import { Formik } from 'formik';
import * as Yup from 'yup';
import HelperIcon from 'src/components/Helper/Icon';
import HelpCircleSvg from 'src/assets/icons/HelpCircle.svg';
import get from 'lodash/get';

import styles from '../../styles.scss';

export type Props = IComponentProps & {
  onSubmit: Function;
  handleSearchBook: Function;
  searchedBooks: any[];
  stepLength?: number;
  buttonLoading: boolean;
};

const NewBook = props => {
  const {
    classes,
    onSubmit,
    handleSearchBook,
    searchedBooks,
    stepLength,
    buttonLoading,
  } = props;
  const searchedBookOptions = searchedBooks.map(b => {
    return {
      value: get(b, 'id', ''),
      label: get(b, 'volumeInfo.title', ''),
      bookObj: b,
    };
  });

  return (
    <div className={classes.step}>
      <label className={classes.searchBookLabel}>
        {stepLength}a) <b>Search</b> for and <b>Select</b> the book you want to
        add to your book bank:{' '}
        <span>
          <HelperIcon
            style={{
              position: 'absolute',
              top: '4px',
              right: '0px',
            }}
            position="right center"
            content={<HelpCircleSvg />}
            helperText="Search for books using the title, author, ISBN, EAN or key words.  If you don't find the book you're looking for, try another search term. Repeat the action to enter multiple books."
          />
        </span>
      </label>
      <div className={classes.createNewBook}>
        <Formik
          onSubmit={onSubmit}
          initialValues={{
            book: '',
          }}
          validationSchema={Yup.object().shape({
            book: Yup.string().required('Book is required'),
          })}>
          {formProps => {
            const {
              values,
              setFieldValue,
              handleSubmit,
              dirty,
              isValid,
            } = formProps;
            return (
              <>
                <div>
                  <ReSelect
                    selectProps={{
                      options: searchedBookOptions,
                      placeholder:
                        'Search by Title, ISBN, Author, or Key words',
                      value: values.book,
                      onChange: val => {
                        setFieldValue('book', val);
                      },
                      className: classes.reSelect,
                      isMulti: true,
                      onInputChange: val => {
                        handleSearchBook(val);
                      },
                      isClearable: false,
                      isSearchBook: true,
                      selectIndicator: true,
                    }}
                  />
                </div>
                {dirty && isValid && (
                  <div className={classes.addBookBtn}>
                    <Button
                      buttonType={ButtonType.ROUND}
                      icon={<PlusWithoutCircleSvg size={20} />}
                      btnClass={cn(classes.button, classes.createBtn)}
                      buttonProps={{
                        size: 'large',
                        type: 'button',
                        onClick: () => {
                          handleSubmit();
                        },
                        loading: buttonLoading,
                      }}>
                      Add Book
                    </Button>
                  </div>
                )}
              </>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default themr<Props>('NewBook', styles)(NewBook);
