import request from './request';

export async function getUserGroups(userId: string) {
  return request.call({
    url: `/user/${userId}`,
    method: 'GET',
    params: {
      include: 'goals.entries,goals.progress',
    },
  });
}
export async function getAllOrganizerGroups(organizationId: string) {
  return request.call({
    url: `/organization/${organizationId}/groups`,
    method: 'GET',
  });
}
