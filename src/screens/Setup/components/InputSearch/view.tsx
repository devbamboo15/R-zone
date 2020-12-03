/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import * as React from 'react';
import Input from 'src/components/FormFields/Input';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import { Loader } from 'semantic-ui-react';

export type InputSearchProps = IComponentProps & {
  onSelect: Function;
  onChange: Function;
  handleChange: Function;
  name: string;
  placeholder: string;
  value: string;
  searchGoalCodes?: Function;
  resetSearchGoalCodes?: Function;
  searchProgram?: any;
  searchProgramGroups?: any[];
  serchProgramsLoading?: boolean;
  serchProgramsStatus?: string;
};

class InputSearch extends React.Component<InputSearchProps> {
  handleSearch = debounce((text: string) => {
    const { searchGoalCodes } = this.props;
    if (text && text.length === 5) {
      searchGoalCodes(text);
    }
  }, 300);

  componentDidMount() {
    const { resetSearchGoalCodes } = this.props;
    resetSearchGoalCodes();
  }

  render() {
    const {
      classes,
      onSelect,
      onChange,
      value,
      name,
      placeholder,
      handleChange,
      searchProgram,
      serchProgramsLoading,
      serchProgramsStatus,
      searchProgramGroups,
      resetSearchGoalCodes,
    } = this.props;
    const finishedSearch =
      !serchProgramsLoading &&
      ['success', 'failure'].includes(serchProgramsStatus);
    const isSearching =
      serchProgramsLoading && serchProgramsStatus === 'request';
    const hasProgram = !isEmpty(searchProgram);
    return (
      <div className={classes.wrapper}>
        <Input
          inputProps={{
            placeholder,
            name,
            value,
            onChange: e => {
              handleChange(e);
              this.handleSearch(e.target.value);
              onChange(e);
              resetSearchGoalCodes();
            },
          }}
        />
        {isSearching && (
          <div className={classes.inputLoader}>
            <Loader active size="small" />
          </div>
        )}
        {finishedSearch && (
          <div className={classes.result}>
            <ul>
              <li
                onClick={() => {
                  if (hasProgram) {
                    onSelect(searchProgram, searchProgramGroups);
                    resetSearchGoalCodes();
                  }
                }}>
                {hasProgram
                  ? get(searchProgram, 'attributes.name', '')
                  : 'No matching programs found'}
              </li>
            </ul>
          </div>
        )}
      </div>
    );
  }
}

export default InputSearch;
