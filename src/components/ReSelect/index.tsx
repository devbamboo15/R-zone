import * as React from 'react';
import themr from 'src/helpers/themr';
import ArrowDown from 'src/assets/icons/arrowDown.svg';
import { CommonProps } from 'react-select/lib/types';
import Select, { components } from 'react-select';
import cn from 'classnames';
import get from 'lodash/get';
import findIndex from 'lodash/findIndex';
import { FormField, GridColumn } from 'semantic-ui-react';
import Label from 'src/components/FormFields/Label';
import styles from './styles.scss';

export type BaseSelectProps = IComponentProps & {
  selectProps: CommonProps;
  selectType?: string;
  label?: string;
  errorMessage?: any;
  optionWithCheckbox?: boolean;
};
export enum SelectType {
  FILTER_TRANSPARENT = 'filter_transparent',
}

const DropdownIndicator = () => (
  <div className={styles.dropdownIcon}>
    <ArrowDown width={19} height={10} />
  </div>
);
const SelectIndicator = () => (
  <div className={styles.dropdownIcon}>
    <i className="dropdown icon" />
  </div>
);

const MultiValueContainer = props => {
  const selectedValue = get(props, 'data.value', '');
  const selectedLabel = get(props, 'data.label', '');
  const selectedValues = get(props, 'selectProps.value') || [];
  const multiLabel = get(props, 'selectProps.multiLabel', '');
  const isFirst = findIndex(selectedValues, { value: selectedValue }) === 0;
  const valuesLength = selectedValues.length;
  if (valuesLength === 1) {
    return <span className={styles.selectedValue}>{selectedLabel}</span>;
  }
  return (
    <span
      className={
        !isFirst ? styles.hide : ''
      }>{`${valuesLength} ${multiLabel}`}</span>
  );
};
const MenuList = props => {
  return (
    <div className={styles.menuWithCheckbox}>
      <components.MenuList {...props}>{props.children}</components.MenuList>
    </div>
  );
};
const SearchBookCustomOption = props => {
  const { value, label, data } = props;
  const { bookObj } = data;
  const author = get(bookObj, 'volumeInfo.authors[0]', '');
  if (value === 'new') {
    return <components.Option {...props} />;
  }
  return (
    <components.Option {...props}>
      {label}{' '}
      {author ? <span className={styles.bookAuthor}>By: {author}</span> : ''}
    </components.Option>
  );
};
const customStyles = (selectProps: CommonProps) => {
  const { isAllisSingle } = selectProps;
  return {
    control: (bases, state) => ({
      ...bases,
      borderRadius: 10,
      boxShadow: state.isFocused ? '0 0 0 1px #8946DF' : 0,
      opacity: state.isDisabled ? '0.5' : '1',
      backgroundColor: state.isDisabled ? 'white' : 'white',
      borderColor: state.isFocused
        ? '#8946DF'
        : state.selectProps.error
        ? 'red'
        : bases.borderColor,
      '&:hover': {
        borderColor: state.isFocused ? '#8946DF' : bases.borderColor,
      },
    }),
    option: (provided, state) => {
      return {
        ...provided,
        '&:before': {
          display:
            state.value === 'new' ? 'none !important' : 'block !important',
          borderColor: state.isSelected ? '#67DF54 !important' : '',
          background: state.isSelected ? '#67DF54 !important' : '',
        },
        '&:after': {
          display:
            state.isSelected && state.value !== 'new'
              ? 'block !important'
              : 'none',
        },
      };
    },
    noOptionsMessage: bases => {
      return {
        ...bases,
        '&:before': {
          display: 'none !important',
        },
        '&:after': {
          display: 'none !important',
        },
      };
    },
    multiValue: (bases, state) => {
      return {
        ...bases,
        backgroundColor:
          get(state, 'data.value', '') === 'all' && isAllisSingle
            ? 'transparent'
            : 'rgba(72, 0, 165, 0.1)',
        borderRadius: '7px',
      };
    },
    multiValueLabel: (bases, state) => {
      return {
        ...bases,
        color:
          get(state, 'data.value', '') === 'all' && isAllisSingle
            ? 'rgba(0, 0, 0, 0.87)'
            : '#4800A5',
      };
    },
    multiValueRemove: (bases, state) => ({
      ...bases,
      color: '#4800A5',
      display:
        get(state, 'data.value', '') === 'all' && isAllisSingle
          ? 'none'
          : 'flex',
    }),
    placeholder: bases => ({
      ...bases,
      color: '#6E6E6E',
      whiteSpace: 'nowrap',
    }),
    indicatorSeparator: () => ({ display: 'none' }),
  };
};

class ReSelect extends React.Component<BaseSelectProps, {}> {
  render() {
    const {
      classes,
      selectProps,
      selectType,
      errorMessage,
      label,
    } = this.props;
    const { optionWithCheckbox, isSearchBook, selectIndicator } = selectProps;
    let selectComponents = {};
    if (optionWithCheckbox) {
      selectComponents = {
        DropdownIndicator: selectIndicator
          ? SelectIndicator
          : DropdownIndicator,
        MultiValueContainer,
        MenuList,
      };
    } else {
      selectComponents = {
        DropdownIndicator: selectIndicator
          ? SelectIndicator
          : DropdownIndicator,
      };
    }
    if (isSearchBook) {
      selectComponents = {
        ...selectComponents,
        Option: SearchBookCustomOption,
      };
    }

    if (label) {
      return (
        <GridColumn>
          <FormField className={classes.column}>
            {label && (
              <Label classes={{ labelStyle: classes.label }}>{label}</Label>
            )}

            <Select
              {...selectProps}
              className={cn(selectProps.className, classes.select, {
                [classes.filterTransparent]:
                  selectType === SelectType.FILTER_TRANSPARENT,
              })}
              components={selectComponents}
            />

            {errorMessage && (
              <div className={classes.errorMessage}>{errorMessage}</div>
            )}
          </FormField>
        </GridColumn>
      );
    }
    return (
      <>
        <Select
          {...selectProps}
          className={cn(selectProps.className, classes.select, {
            [classes.filterTransparent]:
              selectType === SelectType.FILTER_TRANSPARENT,
          })}
          styles={customStyles(selectProps)}
          components={selectComponents}
        />
      </>
    );
  }
}

export default themr<BaseSelectProps>('Select', styles)(ReSelect);
