import request from './request';

export async function meChild() {
  return request.call({
    url: '/me/child',
    method: 'GET',
  });
}
export interface IMeChild {
  first_name: string;
  last_name: string;
}

export async function addMeChild(data: IMeChild) {
  return request.call({
    url: '/me/child/v2',
    method: 'POST',
    data,
  });
}

export async function meChildDetails(readerId: string) {
  return request.call({
    url: `/me/child/${readerId}/details`,
    method: 'GET',
  });
}

export interface IMeProgramParams {
  include?: string;
}

export async function meProgram(params?: IMeProgramParams) {
  return request.call({
    url: '/me/programs',
    method: 'GET',
    params,
  });
}
