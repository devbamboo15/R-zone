import get from 'lodash/get';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import * as moment from 'moment';

const getOptions = (arr, newOption) => {
  const returnOptions = [...arr, ...[newOption]];
  return returnOptions || [];
};

const getReaderOption = childData => {
  return getOptions(childData, {
    id: 'new',
    attributes: {
      name: '+ Create Reader',
    },
  }).map(r => {
    return {
      value: get(r, 'id', ''),
      text: get(r, 'attributes.name', ''),
    };
  });
};

const getAllProgram = childDetailProgram => {
  return getOptions(childDetailProgram || [], {
    id: 'new',
    name: '+ Add Program',
  });
};

const getGroupOptions = groups => {
  return getOptions(groups, {
    id: 'new',
    name: '+ Add Group',
    metric: '',
    goal: '',
  }).map(g => {
    return {
      value: g.id.toString(),
      text: g.name,
      metricId: g.metric || g.active_metric_id,
      goalId: g.goal || g.active_goal_id,
    };
  });
};

const getGoalId = (values, programs) => {
  const foundProgram = find(programs || [], { id: values.program }) || {};
  const foundGroup =
    find(foundProgram.groups || [], { id: values.group }) || {};
  return foundGroup.active_goal_id || '';
};

const isNotEndGroup = group => {
  const now = moment();
  return moment(get(group, 'end_date')).isSameOrAfter(now, 'd');
};

const isActiveProgram = program => {
  const notEndGroups =
    (get(program, 'groups') || []).filter(g => isNotEndGroup(g)) || [];
  return notEndGroups.length >= 1;
};

const getOptionData = (
  values,
  childData = [],
  childDetailProgram = [],
  books = []
) => {
  const readerOptions = getReaderOption(childData);
  const allPrograms = getAllProgram(
    childDetailProgram.filter(p => isActiveProgram(p))
  );
  const programOptions = allPrograms.map(p => {
    return {
      value: p.id.toString(),
      text: p.name,
    };
  });
  const selectedProgram =
    find(allPrograms, {
      id: values.program,
    }) || {};
  const groupOptions = getGroupOptions(
    (selectedProgram.groups || []).filter(g => isNotEndGroup(g))
  );
  const bookOptions = (books || [])
    .filter(b => (get(b, 'group_id') || '').toString() === values.group)
    .map(b => {
      return {
        value: get(b, 'id', ''),
        label: get(b, 'volumeInfo.title', ''),
        bookObj: b,
      };
    });
  bookOptions.push({
    value: 'new',
    label: '+ Add Book',
    bookObj: {},
  });
  const allBookIds = bookOptions.map(b => b.value) || [];

  return {
    readerOptions,
    programOptions,
    groupOptions,
    bookOptions,
    selectedProgram,
    allBookIds,
  };
};

const isNewValueAsObject = val => {
  if (typeof val !== 'object') {
    return false;
  }
  return !isEmpty(find(val, { value: 'new' }));
};

export {
  getOptions,
  getReaderOption,
  getAllProgram,
  getGroupOptions,
  getGoalId,
  getOptionData,
  isNewValueAsObject,
  isNotEndGroup,
  isActiveProgram,
};
