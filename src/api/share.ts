import request from './request';

export interface IShareItem {
  program_id: number;
  title_text: string;
  greeting_text: string;
  post_text: string;
}
// Get user roles

export async function getShares() {
  return request.call({
    url: `/user/share`,
    method: 'GET',
  });
}

export interface ILeaderboardBadge {
  program_id: any;
  badge_type: number;
  organization_id: any;
  metric_id?: any;
  group_id?: any;
}

export async function getUserLeaderboard(
  programIds: any,
  badgeType: number,
  organizationId: string,
  groupIds: any,
  metricIds: any
) {
  let params: ILeaderboardBadge = {
    program_id: programIds,
    badge_type: badgeType,
    organization_id: organizationId,
  };
  if (groupIds) {
    params = {
      ...params,
      group_id: groupIds,
    };
  }
  if (metricIds) {
    params = {
      ...params,
      metric_id: metricIds,
    };
  }
  return request.call({
    url: `/user/leaderboard`,
    method: 'GET',
    params,
  });
}

export async function updateShare(data: IShareItem) {
  return request.call({
    url: `/user/share`,
    method: 'POST',
    data: {
      program_id: data.program_id,
      title_text: data.title_text,
      greeting_text: data.greeting_text,
      post_text: data.post_text,
    },
  });
}

export async function deleteShare() {
  return request.call({
    url: `/user/share/delete`,
    method: 'DELETE',
  });
}
