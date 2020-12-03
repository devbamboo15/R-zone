import * as React from 'react';
import { Grid, GridColumn } from 'semantic-ui-react';
import get from 'lodash/get';
// import flatten from 'lodash/flatten';
import ReSelect, { SelectType } from 'src/components/ReSelect';
import ArrowUp from 'src/assets/icons/arrowUp.svg';
import ArrowDown from 'src/assets/icons/arrowDownWhite.svg';
import themr from 'src/helpers/themr';
import DateRangPicker from 'src/components/DateRangePicker';
import Checkbox from 'src/components/FormFields/Checkbox';
import cn from 'classnames';
import { IProgram } from 'src/store/types/organizer/program';
import { IOrganizerGroupItem } from 'src/store/types/organizer/group';
import Button from 'src/components/Button';
import * as moment from 'moment';
import styles from './styles.scss';

export type FilterProps = IComponentProps & {
  isShowMoreFilter: boolean;
  toggleFilters: () => void;
  programs?: IProgram[];
  groups?: IOrganizerGroupItem[];
  readers?: any[];
  onChangeFilter: Function;
  onSubmitFilter: () => void;
  buttonLoading?: boolean;
  getUserQuestions: Function;
};

enum SortEnum {
  'group' = 'group',
  'program' = 'program',
  'reader' = 'reader',
}

const fakeOptionsFilterActivity = [
  {
    label: 'Most Recent',
    value: '1',
  },
  {
    label: 'Most View',
    value: '2',
  },
];
const programTypeOptions = [
  {
    label: 'All Type',
    value: 4,
  },
  {
    label: 'Goal Based',
    value: 0,
  },
  {
    label: 'Reading Log',
    value: 1,
  },
  {
    label: 'Group vs. Group',
    value: 2,
  },
  {
    label: 'Reader vs. Reader',
    value: 3,
  },
];
const groupMetricTypeOptions = [
  {
    label: 'All Metrics',
    value: 'none',
  },
  {
    label: 'Books',
    value: 'books',
  },
  {
    label: 'Chapters',
    value: 'chapters',
  },
  {
    label: 'Minutes',
    value: 'minutes',
  },
  {
    label: 'Pages',
    value: 'pages',
  },
  {
    label: '"Yes" Entries ',
    value: 'yes/no',
  },
];

const fakeOptionsFilterDay = [
  {
    label: 'Custom',
    value: 'none',
  },
  {
    label: 'Last 7 Days',
    value: '7',
  },
  {
    label: 'Last 30 Days',
    value: '30',
  },
  {
    label: 'All times',
    value: 'all',
  },
];
interface IProgramSort {
  type?: number;
}
interface IGroupSort {
  metric?: string;
}
interface IQuestionFilters {
  address: boolean;
  grade_level: boolean;
  library_card_number: boolean;
  school: boolean;
  birthday: boolean;
}
interface FilterStates {
  programCondition: string;
  groupCondition: string;
  readerCondition: string;
  programsFilter?: any;
  dateFilter?: any;
  parentOption: string;
  programSort: IProgramSort;
  groupSort: IGroupSort;
  formValue?: any;
  questionFilter: IQuestionFilters;
  questionFilterShow: IQuestionFilters;
}
class Filter extends React.Component<FilterProps, FilterStates> {
  constructor(props) {
    super(props);
    this.state = {
      programCondition: '',
      programSort: {},
      groupCondition: '',
      groupSort: {},
      readerCondition: '',
      programsFilter: {},
      questionFilter: {
        address: true,
        grade_level: true,
        library_card_number: true,
        school: true,
        birthday: true,
      },
      questionFilterShow: {
        address: true,
        grade_level: true,
        library_card_number: true,
        school: true,
        birthday: true,
      },
      dateFilter: {
        range: {
          startDate: moment(),
          endDate: moment(),
        },
        customDate: 'none',
      },
      parentOption: '',
      formValue: {
        group: [],
        reader: [],
      },
    };
  }

  getGroupIdsOfSelectedProgram = () => {
    const { programs } = this.props;
    const { programsFilter } = this.state;
    const selectedPrograms = get(programsFilter, 'program') || [];
    const filteredGroups = [];
    programs
      .filter(p => selectedPrograms.indexOf(p.id) >= 0)
      .map(p => {
        (get(p, 'data.relationships.groups.data') || []).map(g => {
          // (get(p, 'relationships.groups.data') || []).map(g => {
          filteredGroups.push(g.id);
          return true;
        });
        return true;
      });
    return filteredGroups || [];
  };

  isBelongToGroup = (readerGroupIds = []) => {
    const { programsFilter } = this.state;
    const selectedGroups = get(programsFilter, 'group') || [];
    let belongTo = false;
    selectedGroups.map(id => {
      if (readerGroupIds.indexOf(id) >= 0) {
        belongTo = true;
      }
      return true;
    });
    return belongTo;
  };

  renderOptionSortIds = (sort: SortEnum) => {
    const { props } = this;
    const filteredGroupIds = this.getGroupIdsOfSelectedProgram();
    let options = [];
    switch (sort) {
      case 'program':
        options = get(props, 'programs', []).map((item: any) => ({
          value: item.id,
          // label: item.attributes.name,
          label: item.label,
        }));
        break;
      case 'group':
        options = get(props, 'groups', [])
          .filter(g => filteredGroupIds.indexOf(g.group_id) >= 0)
          .map((item: any) => ({
            value: item.group_id.toString(),
            label: item.group_name,
          }));
        break;
      case 'reader':
        options = get(props, 'readers', [])
          .filter((item: any) => this.isBelongToGroup(item.group || []))
          .map((item: any) => ({
            value: item.user_id.toString(),
            label: `${item.first_name} ${item.last_name}`,
          }));
        break;
      default:
        options = [];
        break;
    }
    return options;
  };

  setQuestionFilterChecked = (filterName, value) => {
    const { questionFilter } = this.state;
    this.setState(
      {
        questionFilter: { ...questionFilter, [filterName]: value },
      },
      () => {
        this.props.onChangeFilter(this.state);
      }
    );
  };

  /* updateQuestionFilterStates = (
    selectedPrograms: any[],
    selectedGroups: any[]
  ) => {
    const result = {
      address: true,
      grade_level: true,
      library_card_number: true,
      school: true,
      birthday: true,
    };
    let _selectedGroups;
    const _selectedPrograms = selectedPrograms.map(x => parseInt(x, 10));
    if (selectedGroups.length) {
      _selectedGroups = selectedGroups;
    } else if (selectedPrograms.length) {
      _selectedGroups = flatten(
        (this.props.programs as any)
          .filter(a => selectedPrograms.includes(a.id))
          .map(a => a.data.relationships.groups.data.map(b => b.id))
      );
    } else {
      this.setState(
        {
          questionFilterShow: result,
        },
        () => {
          this.props.onChangeFilter(this.state);
        }
      );
    }

    const { readers } = this.props;
    const activeReaders = [];

    for (const reader of readers) {
      if (
        intersection(reader.group, _selectedGroups).length ||
        intersection(reader.programs, _selectedPrograms).length
      ) {
        activeReaders.push(reader);
      }
    }

    if (activeReaders.length) {
      const readerIds = activeReaders.map(x => x.user_id);
      let hasAddress = false;
      let hasGradeLevel = false;
      let hasLibraryCardNumber = false;
      let hasSchool = false;
      let hasBirthday = false;
      getUserQuestions(readerIds, true, res => {
        const values = Object.values(res);
        for (const value of values) {
          for (const question of value as any) {
            if (
              !hasAddress &&
              (question as any).id === '1' &&
              !isEmpty(get(question, 'attributes.answer'))
            ) {
              hasAddress = true;
            } else if (
              !hasBirthday &&
              (question as any).id === '2' &&
              !isEmpty(get(question, 'attributes.answer'))
            ) {
              hasBirthday = true;
            } else if (
              !hasLibraryCardNumber &&
              (question as any).id === '3' &&
              !isEmpty(get(question, 'attributes.answer'))
            ) {
              hasLibraryCardNumber = true;
            } else if (
              !hasSchool &&
              (question as any).id === '4' &&
              !isEmpty(get(question, 'attributes.answer'))
            ) {
              hasSchool = true;
            } else if (
              !hasGradeLevel &&
              (question as any).id === '5' &&
              !isEmpty(get(question, 'attributes.answer'))
            ) {
              hasGradeLevel = true;
            }
          }
        }
        result.address = hasAddress;
        result.grade_level = hasGradeLevel;
        result.library_card_number = hasLibraryCardNumber;
        result.school = hasSchool;
        result.birthday = hasBirthday;
        this.setState(
          {
            questionFilterShow: result,
          },
          () => {
            this.props.onChangeFilter(this.state);
          }
        );
      });
    } else {
      result.address = false;
      result.grade_level = false;
      result.library_card_number = false;
      result.school = false;
      result.birthday = false;
      this.setState(
        {
          questionFilterShow: result,
        },
        () => {
          this.props.onChangeFilter(this.state);
        }
      );
    }
  }; */

  /* componentDidUpdate(_, prevState) {
    const { programsFilter } = this.state;
    const { programsFilter: prevProgramsFilter } = prevState;
    if (prevProgramsFilter !== programsFilter) {
      const selectedPrograms = get(programsFilter, 'program') || [];
      const selectedGroups = get(programsFilter, 'group') || [];
      this.updateQuestionFilterStates(selectedPrograms, selectedGroups);
    }
  } */

  render() {
    const { props } = this;
    const {
      classes,
      isShowMoreFilter,
      toggleFilters,
      onChangeFilter,
      onSubmitFilter,
      buttonLoading,
    } = props;
    const {
      programsFilter,
      dateFilter,
      parentOption,
      programCondition,
      groupCondition,
      readerCondition,
      formValue,
    } = this.state;
    const startDateData = get(dateFilter, 'range.startDate');
    const endDateData = get(dateFilter, 'range.endDate');
    const selectedPrograms = get(programsFilter, 'program') || [];
    const selectedGroups = get(programsFilter, 'group') || [];
    return (
      <Grid>
        <label className={classes.filterByLabel}>Filter by:</label>
        <Grid.Row>
          <Grid.Column width={12}>
            <Grid columns={3}>
              <Grid.Row>
                <Grid.Column>
                  <ReSelect
                    selectProps={{
                      options: this.renderOptionSortIds(SortEnum.program),
                      isMulti: true,
                      onChange: value => {
                        const isRemove =
                          (value || []).length < selectedPrograms.length;
                        this.setState(
                          {
                            formValue: {
                              ...formValue,
                              group: isRemove ? [] : formValue.group,
                              reader: isRemove ? [] : formValue.reader,
                            },
                            programsFilter: {
                              ...programsFilter,
                              program: value.map(v => v.value),
                              group: isRemove ? [] : programsFilter.group,
                              reader: isRemove ? [] : programsFilter.reader,
                            },
                          },
                          () => {
                            onChangeFilter(this.state);
                          }
                        );
                      },
                      placeholder: 'Select Program',
                    }}
                  />
                </Grid.Column>
                <Grid.Column>
                  <ReSelect
                    selectProps={{
                      options: this.renderOptionSortIds(SortEnum.group),
                      isMulti: true,
                      isDisabled: selectedPrograms.length <= 0,
                      value: formValue.group,
                      onChange: value => {
                        const isRemove =
                          (value || []).length < selectedPrograms.length;
                        this.setState(
                          {
                            formValue: {
                              ...formValue,
                              group: value,
                              reader: isRemove ? [] : formValue.reader,
                            },
                            programsFilter: {
                              ...programsFilter,
                              group: value.map(v => v.value),
                              reader: isRemove ? [] : programsFilter.reader,
                            },
                          },
                          () => {
                            onChangeFilter(this.state);
                          }
                        );
                      },
                      placeholder: 'Select Group',
                    }}
                  />
                </Grid.Column>
                <Grid.Column>
                  <ReSelect
                    selectProps={{
                      options: this.renderOptionSortIds(SortEnum.reader),
                      isMulti: true,
                      isDisabled: selectedGroups.length <= 0,
                      value: formValue.reader,
                      onChange: value => {
                        this.setState(
                          {
                            formValue: {
                              ...formValue,
                              reader: value,
                            },
                            programsFilter: {
                              ...programsFilter,
                              reader: value.map(v => v.value),
                            },
                          },
                          () => {
                            onChangeFilter(this.state);
                          }
                        );
                      },
                      placeholder: 'Reader',
                    }}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
            {isShowMoreFilter && (
              <>
                <Grid columns={1}>
                  <Grid.Row>
                    {/* <Grid.Column className={classes.col3}>
                      <div className={classes.sectionFilter}>
                        <Checkbox
                          checkboxProps={{
                            radio: true,
                            checked: parentOption === 'activity',
                            label: 'Activity:',
                            onChange: () => {
                              this.setState(
                                {
                                  parentOption: 'activity',
                                },
                                () => {
                                  onChangeFilter(this.state);
                                }
                              );
                            },
                          }}
                        />
                        <ReSelect
                          selectProps={{
                            options: fakeOptionsFilterActivity,
                            // onChange: value => {},
                            placeholder: 'Activity',
                          }}
                          selectType={SelectType.FILTER_TRANSPARENT}
                        />
                      </div>
                    </Grid.Column> */}
                    <Grid.Column className={classes.col12}>
                      <div className={classes.sectionFilter}>
                        <GridColumn width={1}>
                          <Checkbox
                            checkboxProps={{
                              radio: true,
                              checked: parentOption === 'date',
                              label: 'Date',
                              onChange: () => {
                                this.setState(
                                  {
                                    parentOption: 'date',
                                  },
                                  () => {
                                    onChangeFilter(this.state);
                                  }
                                );
                              },
                            }}
                          />
                        </GridColumn>
                        <GridColumn className={classes.filterDate1}>
                          <div>
                            <DateRangPicker
                              onDatesChange={({ startDate, endDate }) => {
                                const oldDateFilter = this.state.dateFilter;
                                this.setState(
                                  {
                                    dateFilter: {
                                      ...oldDateFilter,
                                      range: {
                                        startDate,
                                        endDate: endDate || startDate,
                                      },
                                    },
                                  },
                                  () => {
                                    onChangeFilter(this.state);
                                  }
                                );
                              }}
                              startDate={startDateData}
                              endDate={endDateData}
                            />
                          </div>
                        </GridColumn>
                        <GridColumn className={classes.customDateWrapper}>
                          <div className={classes.filterDateSelect}>
                            <label className={classes.filterOr}>Or</label>
                            <ReSelect
                              selectProps={{
                                options: fakeOptionsFilterDay,
                                value: this.state.dateFilter.customDate,
                                defaultValud: this.state.dateFilter.customDate,
                                onChange: value => {
                                  const oldDateFilter = this.state.dateFilter;
                                  this.setState(
                                    {
                                      dateFilter: {
                                        ...oldDateFilter,
                                        customDate: value,
                                      },
                                    },
                                    () => {
                                      onChangeFilter(this.state);
                                    }
                                  );
                                },
                                placeholder: 'days',
                              }}
                              selectType={SelectType.FILTER_TRANSPARENT}
                            />
                          </div>
                        </GridColumn>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
                <Grid>
                  <Grid.Row>
                    <Grid.Column>
                      <div className={classes.sectionFilter}>
                        <div className={classes.leftSectionFilter}>
                          <div className={classes.mainCheckbox}>
                            <Checkbox
                              checkboxProps={{
                                radio: true,
                                checked: parentOption === 'program',
                                label: 'Program Conditions:',
                                onChange: () => {
                                  this.setState(
                                    {
                                      parentOption: 'program',
                                    },
                                    () => {
                                      onChangeFilter(this.state);
                                    }
                                  );
                                },
                              }}
                            />
                          </div>
                          <div className={classes.childCheckbox}>
                            <Checkbox
                              checkboxProps={{
                                value: 'no_entries',
                                label: 'No Entries',
                                radio: true,
                                checked: programCondition === 'no_entries',
                                onChange: () => {
                                  this.setState(
                                    {
                                      programCondition: 'no_entries',
                                    },
                                    () => {
                                      onChangeFilter(this.state);
                                    }
                                  );
                                },
                              }}
                            />
                            <span className={classes.spacing} />
                            <Checkbox
                              checkboxProps={{
                                value: 'no_users',
                                label: 'No Users',
                                radio: true,
                                checked: programCondition === 'no_users',
                                onChange: () => {
                                  this.setState(
                                    {
                                      programCondition: 'no_users',
                                    },
                                    () => {
                                      onChangeFilter(this.state);
                                    }
                                  );
                                },
                              }}
                            />
                          </div>
                        </div>
                        <div className={classes.rightSectionFilter}>
                          <div style={{ visibility: 'hidden' }}>
                            <ReSelect
                              selectProps={{
                                options: fakeOptionsFilterActivity,
                                // onChange: value => {},
                                placeholder: 'Sort Most/Least Entries',
                                style: { visibility: 'hidden' },
                              }}
                              selectType={SelectType.FILTER_TRANSPARENT}
                            />
                          </div>
                          <div style={{ visibility: 'hidden' }}>
                            <ReSelect
                              selectProps={{
                                options: fakeOptionsFilterActivity,
                                // onChange: value => {},
                                placeholder: 'Sort Most/Least Entries',
                                style: { visibility: 'hidden' },
                              }}
                              selectType={SelectType.FILTER_TRANSPARENT}
                            />
                          </div>
                          <div style={{ width: '180px' }}>
                            <ReSelect
                              selectProps={{
                                options: programTypeOptions,
                                onChange: value => {
                                  this.setState(
                                    {
                                      programSort: {
                                        type: value.value,
                                      },
                                    },
                                    () => {
                                      onChangeFilter(this.state);
                                    }
                                  );
                                },
                                placeholder: 'Type',
                              }}
                              selectType={SelectType.FILTER_TRANSPARENT}
                            />
                          </div>
                        </div>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
                <Grid>
                  <Grid.Row>
                    <Grid.Column>
                      <div className={classes.sectionFilter}>
                        <div className={classes.leftSectionFilter}>
                          <div className={classes.mainCheckbox}>
                            <Checkbox
                              checkboxProps={{
                                radio: true,
                                checked: parentOption === 'group',
                                label: 'Group Conditions:',
                                onChange: () => {
                                  this.setState(
                                    {
                                      parentOption: 'group',
                                    },
                                    () => {
                                      onChangeFilter(this.state);
                                    }
                                  );
                                },
                              }}
                            />
                          </div>
                          <div className={classes.childCheckbox}>
                            <Checkbox
                              checkboxProps={{
                                value: 'no_entries',
                                label: 'No Entries',
                                radio: true,
                                checked: groupCondition === 'no_entries',
                                onChange: () => {
                                  this.setState(
                                    {
                                      groupCondition: 'no_entries',
                                    },
                                    () => {
                                      onChangeFilter(this.state);
                                    }
                                  );
                                },
                              }}
                            />
                            <span className={classes.spacing} />
                            <Checkbox
                              checkboxProps={{
                                value: 'no_users',
                                label: 'No Users',
                                radio: true,
                                checked: groupCondition === 'no_users',
                                onChange: () => {
                                  this.setState(
                                    {
                                      groupCondition: 'no_users',
                                    },
                                    () => {
                                      onChangeFilter(this.state);
                                    }
                                  );
                                },
                              }}
                            />
                          </div>
                        </div>
                        <div className={classes.rightSectionFilter}>
                          <div style={{ visibility: 'hidden' }}>
                            <ReSelect
                              selectProps={{
                                options: fakeOptionsFilterActivity,
                                // onChange: value => {},
                                placeholder: 'Sort Most/Least Entries',
                              }}
                              selectType={SelectType.FILTER_TRANSPARENT}
                            />
                          </div>
                          <div style={{ visibility: 'hidden' }}>
                            <ReSelect
                              selectProps={{
                                options: fakeOptionsFilterActivity,
                                // onChange: value => {},
                                placeholder: 'Sort Most/Least Entries',
                              }}
                              selectType={SelectType.FILTER_TRANSPARENT}
                            />
                          </div>
                          <div style={{ width: '180px' }}>
                            <ReSelect
                              selectProps={{
                                options: groupMetricTypeOptions,
                                onChange: value => {
                                  this.setState(
                                    {
                                      groupSort: {
                                        metric: value.value,
                                      },
                                    },
                                    () => {
                                      onChangeFilter(this.state);
                                    }
                                  );
                                },
                                placeholder: 'Metric',
                              }}
                              selectType={SelectType.FILTER_TRANSPARENT}
                            />
                          </div>
                        </div>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
                <Grid>
                  <Grid.Row>
                    <Grid.Column>
                      <div className={classes.sectionFilter}>
                        <div
                          className={cn(
                            classes.leftSectionFilter,
                            classes.leftLargeSectionFilter
                          )}>
                          <div className={classes.mainCheckbox}>
                            <Checkbox
                              checkboxProps={{
                                radio: true,
                                checked: parentOption === 'reader',
                                label: 'Reader Conditions:',
                                onChange: () => {
                                  this.setState(
                                    {
                                      parentOption: 'reader',
                                    },
                                    () => {
                                      onChangeFilter(this.state);
                                    }
                                  );
                                },
                              }}
                            />
                          </div>
                          <div className={classes.childCheckbox}>
                            <Checkbox
                              checkboxProps={{
                                value: 'no_entries',
                                label: 'No Entries',
                                radio: true,
                                checked: readerCondition === 'no_entries',
                                onChange: () => {
                                  this.setState(
                                    {
                                      readerCondition: 'no_entries',
                                    },
                                    () => {
                                      onChangeFilter(this.state);
                                    }
                                  );
                                },
                              }}
                            />
                            <span className={classes.spacing} />
                            <Checkbox
                              checkboxProps={{
                                value: 'no_users',
                                label: 'No Users',
                                radio: true,
                                checked: readerCondition === 'no_users',
                                onChange: () => {
                                  this.setState(
                                    {
                                      readerCondition: 'no_users',
                                    },
                                    () => {
                                      onChangeFilter(this.state);
                                    }
                                  );
                                },
                              }}
                            />
                            <span className={classes.spacing} />
                            <Checkbox
                              checkboxProps={{
                                value: 'complete_goal',
                                label: 'Completed Goal',
                                radio: true,
                                checked: readerCondition === 'complete_goal',
                                onChange: () => {
                                  this.setState(
                                    {
                                      readerCondition: 'complete_goal',
                                    },
                                    () => {
                                      onChangeFilter(this.state);
                                    }
                                  );
                                },
                              }}
                            />
                          </div>
                        </div>
                        <div
                          className={cn(
                            classes.rightSectionFilter,
                            classes.rightSmallSectionFilter
                          )}
                          style={{ visibility: 'hidden' }}>
                          <ReSelect
                            selectProps={{
                              options: fakeOptionsFilterActivity,
                              // onChange: value => {},
                              placeholder: 'Sort Most/Least Entries',
                              style: { visibility: 'hidden' },
                            }}
                            selectType={SelectType.FILTER_TRANSPARENT}
                          />
                        </div>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
                {/* <Grid> */}
                {/*  <Grid.Row> */}
                {/*    <Grid.Column> */}
                {/*      <div className={classes.sectionFilter}> */}
                {/*        <div */}
                {/*          className={cn( */}
                {/*            classes.leftSectionFilter, */}
                {/*            classes.leftLargeSectionFilterAlt */}
                {/*          )}> */}
                {/*          <div className={classes.childCheckboxAlt}> */}
                {/*            <Checkbox */}
                {/*              checkboxProps={{ */}
                {/*                label: 'Show Address', */}
                {/*                disabled: !questionFilterShowStates.address, */}
                {/*                checked: questionFilter.address, */}
                {/*                onChange: (_, { checked }) => { */}
                {/*                  this.setQuestionFilterChecked( */}
                {/*                    'address', */}
                {/*                    checked */}
                {/*                  ); */}
                {/*                }, */}
                {/*              }} */}
                {/*            /> */}
                {/*            <span className={classes.spacing} /> */}
                {/*            <Checkbox */}
                {/*              checkboxProps={{ */}
                {/*                label: 'Show Grade Level', */}
                {/*                disabled: !questionFilterShowStates.grade_level, */}
                {/*                checked: questionFilter.grade_level, */}
                {/*                onChange: (_, { checked }) => { */}
                {/*                  this.setQuestionFilterChecked( */}
                {/*                    'grade_level', */}
                {/*                    checked */}
                {/*                  ); */}
                {/*                }, */}
                {/*              }} */}
                {/*            /> */}
                {/*            <span className={classes.spacing} /> */}
                {/*            <Checkbox */}
                {/*              checkboxProps={{ */}
                {/*                label: 'Show Library Card #', */}
                {/*                disabled: !questionFilterShowStates.library_card_number, */}
                {/*                checked: questionFilter.library_card_number, */}
                {/*                onChange: (_, { checked }) => { */}
                {/*                  this.setQuestionFilterChecked( */}
                {/*                    'library_card_number', */}
                {/*                    checked */}
                {/*                  ); */}
                {/*                }, */}
                {/*              }} */}
                {/*            /> */}
                {/*            <span className={classes.spacing} /> */}
                {/*            <Checkbox */}
                {/*              checkboxProps={{ */}
                {/*                label: 'Show School', */}
                {/*                disabled: !questionFilterShowStates.school, */}
                {/*                checked: questionFilter.school, */}
                {/*                onChange: (_, { checked }) => { */}
                {/*                  this.setQuestionFilterChecked( */}
                {/*                    'school', */}
                {/*                    checked */}
                {/*                  ); */}
                {/*                }, */}
                {/*              }} */}
                {/*            /> */}
                {/*            <span className={classes.spacing} /> */}
                {/*            <Checkbox */}
                {/*              checkboxProps={{ */}
                {/*                label: 'Show Birthdate', */}
                {/*                disabled: !questionFilterShowStates.birthday, */}
                {/*                checked: questionFilter.birthday, */}
                {/*                onChange: (_, { checked }) => { */}
                {/*                  this.setQuestionFilterChecked( */}
                {/*                    'birthday', */}
                {/*                    checked */}
                {/*                  ); */}
                {/*                }, */}
                {/*              }} */}
                {/*            /> */}
                {/*          </div> */}
                {/*        </div> */}
                {/*        <div */}
                {/*          className={cn( */}
                {/*            classes.rightSectionFilter, */}
                {/*            classes.rightSmallSectionFilter */}
                {/*          )} */}
                {/*          style={{ visibility: 'hidden' }}> */}
                {/*          <ReSelect */}
                {/*            selectProps={{ */}
                {/*              options: fakeOptionsFilterActivity, */}
                {/*              // onChange: value => {}, */}
                {/*              placeholder: 'Sort Most/Least Entries', */}
                {/*              style: { visibility: 'hidden' }, */}
                {/*            }} */}
                {/*            selectType={SelectType.FILTER_TRANSPARENT} */}
                {/*          /> */}
                {/*        </div> */}
                {/*      </div> */}
                {/*    </Grid.Column> */}
                {/*  </Grid.Row> */}
                {/* </Grid> */}
              </>
            )}
          </Grid.Column>
          <Grid.Column width={4} className={classes.filterButtons}>
            <Button
              buttonProps={{
                onClick: toggleFilters,
                className: classes.buttonFilter,
              }}>
              {!isShowMoreFilter ? 'More filters' : 'Hide filters'}
              <span className={classes.arrowIcon}>
                {!isShowMoreFilter ? (
                  <ArrowDown width={19} height={10} />
                ) : (
                  <ArrowUp width={19} height={10} />
                )}
              </span>
            </Button>
            <Button
              buttonProps={{
                loading: buttonLoading,
                onClick: () => {
                  onSubmitFilter();
                },
                className: classes.buttonFilterApply,
              }}>
              Apply
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default themr<FilterProps>('Filter', styles)(Filter);
