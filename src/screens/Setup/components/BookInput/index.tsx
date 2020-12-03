import * as React from 'react';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import ReSelect from 'src/components/ReSelect';
import themr from 'src/helpers/themr';
import { isNewValueAsObject } from '../../utils';
import styles from '../../styles.scss';

export type Props = IComponentProps & {
  formProps: any;
  bookOptions: any[];
};

const BookInput = props => {
  const { classes, bookOptions, formProps } = props;
  const { values, setFieldValue } = formProps;
  const { book, metric } = values;
  const [showBookWarning, setShowBookWarning] = React.useState(false);
  const notNewValue = isEmpty(find(values.book, { value: 'new' }) || {});
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <ReSelect
        selectProps={{
          options: Number(metric) === book.length ? book || [] : bookOptions,
          placeholder: 'Book Bank Books',
          value: values.book,
          onFocus: () => {
            setIsOpen(true);
          },
          onBlur: () => {
            setIsOpen(false);
          },
          onChange: val => {
            const newFound = find(val, { value: 'new' }) || {};
            if (!isEmpty(newFound)) {
              setFieldValue('book', [newFound]);
              setIsOpen(false);
              setShowBookWarning(false);
            } else {
              setFieldValue('book', val.length > 0 ? val : '');
            }
          },
          className: classes.reSelect,
          isMulti: true,
          hideSelectedOptions: false,
          optionWithCheckbox: true,
          multiLabel: 'Books',
          isClearable: false,
          closeMenuOnSelect: false,
          menuIsOpen: isOpen,
          isSearchBook: true,
          selectIndicator: true,
          onMenuClose: () => {
            if (notNewValue) {
              setShowBookWarning(!isNewValueAsObject(book));
            }
          },
        }}
      />
      {Number(metric) > book.length && showBookWarning && (
        <div className={classes.selectedLessBook}>
          <b>* You don't have enough books selected</b> to match the number of
          books you are entering as finished. Please select more books or add
          new books to your book bank to select.
        </div>
      )}
    </>
  );
};

export default themr<Props>('BookInput', styles)(BookInput);
