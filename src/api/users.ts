import request from './request';

export interface ICreateAuthUserData {
  first_name: string;
  last_name: string;
  email: string;
  access: any[];
  id?: string;
}

export async function getAllAuthorizedUsers(organizationId: string) {
  return request.call({
    url: `/organization/${organizationId}/user`,
    method: 'GET',
  });
}

export async function getAuthorizedUser(
  organizationId: string,
  userId: string
) {
  return request.call({
    url: `/organization/${organizationId}/user/${userId}`,
    method: 'GET',
    params: {
      include: 'access',
    },
  });
}

export async function deleteAuthorizedUser(
  organizationId: string,
  userId: string
) {
  return request.call({
    url: `/organization/${organizationId}/user/${userId}`,
    method: 'DELETE',
  });
}

export async function deleteAllAuthorizedUsers(
  organizationId: string,
  data: any
) {
  return request.call({
    url: `/organization/${organizationId}/user/all`,
    method: 'DELETE',
    data,
  });
}

export async function addAuthorizedUser(
  organizationId: string,
  data: ICreateAuthUserData
) {
  return request.call({
    url: `/organization/${organizationId}/user`,
    method: 'POST',
    data,
  });
}

export async function updateAuthorizedUser(
  organizationId: string,
  userId: string,
  data: ICreateAuthUserData
) {
  return request.call({
    url: `/organization/${organizationId}/user/${userId}`,
    method: 'PATCH',
    data,
  });
}
