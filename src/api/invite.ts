import request from './request';

export interface ICreateInviteReadersData {
  user_id: string;
  invites: [
    {
      first_name: string;
      last_name: string;
      email: string;
      role_id: string;
      program_id: string;
      group_id: string;
    }
  ];
}

// Send invite user readers
export async function sendInviteReaders(data: ICreateInviteReadersData) {
  return request.call({
    url: '/invitation/manual',
    method: 'POST',
    data,
  });
}

export interface IGetInviteReaders {
  user_id: string;
  page: number;
  programs: string[];
  groups: string[];
  roles: string[];
}

// Get invitation user reader list
export async function getInviteReaders(data: IGetInviteReaders) {
  return request.call({
    url: `/invitation/list`,
    method: 'GET',
    params: data,
  });
}

export interface IPreviewInviteReaderData {
  subject: string;
  body: string;
  to_addr: string;
}
export async function previewInviteReader(data: IPreviewInviteReaderData) {
  return request.call({
    url: `/mail/test`,
    method: 'POST',
    data,
  });
}
