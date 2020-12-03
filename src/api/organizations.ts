import request from './request';

export async function getAllOrganizations() {
  return request.call({
    url: '/me/organizations',
    method: 'GET',
  });
}

export async function getOrganizationProgress(
  id: string,
  programId?: string,
  groupId?: string,
  filterParams?: any
) {
  let url = `/organization/${id}/metrics`;
  if (programId) {
    url = `/organization/${id}/program/${programId}/metrics`;
  }
  if (groupId) {
    url = `/organization/${id}/program/${programId}/group/${groupId}/metrics`;
  }
  const options: any = {
    url,
    method: 'GET',
    params: {
      ...filterParams,
    },
  };
  return request.call(options);
}

export async function setOrganization(id: string) {
  return request.call({
    url: `/me/switch-org/${id}`,
    method: 'POST',
  });
}
