import request from './request';

export async function getAllFeeds(organizationId: string, filter?: any) {
  return request.call({
    url: `/organization/${organizationId}/feed`,
    method: 'GET',
    params: {
      ...filter,
    },
  });
}

export async function getOverviews(organizationId: string, filter?: any) {
  return request.call({
    url: `/organization/${organizationId}/overview`,
    method: 'GET',
    params: {
      ...filter,
    },
  });
}

export async function exportReport(
  organizationId: string,
  exportType: 'overview' | 'activity' | 'all',
  filter: any = {}
) {
  return request.call({
    url: `/organization/${organizationId}/export/${exportType}`,
    method: 'GET',
    params: {
      ...filter,
    },
  });
}
