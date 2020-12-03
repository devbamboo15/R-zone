import find from 'lodash/find';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';

const checkExistingUser = (users = [], user = {}, key = 'id') => {
  const foundUser = find(users, { [key]: user[key] });
  return !!(foundUser && !isEqual(foundUser, {}));
};

const checkExistingAuthorizedUser = (users = [], user = {}) => {
  let filteredUsers = users.filter(u => u.id !== get(user, 'id', ''));
  filteredUsers = filteredUsers.map(u => u.attributes);
  const filteredUser = get(user, 'attributes');
  return checkExistingUser(filteredUsers, filteredUser, 'email');
};

const capitalize = (s = '') => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const detectMobile = () => {
  const toMatch = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
  ];

  return toMatch.some(toMatchItem => {
    return navigator.userAgent.match(toMatchItem);
  });
};

export {
  checkExistingUser,
  checkExistingAuthorizedUser,
  capitalize,
  detectMobile,
};
