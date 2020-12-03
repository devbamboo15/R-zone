import createTypes from 'redux-create-action-types';

export default createTypes(
  // Role
  'USER_ROLES',
  'USER_ROLES_SUCCESS',
  'USER_ROLES_ERROR'
);

export interface IRoleItem {
  type: string;
  id: string;
  attributes: {
    title: string;
    scopes: string[];
  };
}
export interface IRoleSelection {
  label: string;
  value: string;
  data: IRoleItem;
}
