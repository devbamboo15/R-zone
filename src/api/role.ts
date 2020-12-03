import request from './request';

// Get user roles

export async function getUserRoles() {
  return request.call({
    url: `/user/roles`,
    method: 'GET',
  });
}
