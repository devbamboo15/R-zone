import request from './request';

export interface ICreateCombinedProgramData {
  program: {
    name: string;
    reading_log: 0 | 1;
  };
  group: {
    name: string;
  };
  goal: {
    start_date: string;
    end_date: string;
    value: string;
    metric_id: string;
    interval_id: string;
  };
  book: {
    id: string;
  };
}

export async function getNewProgramCode(organizationId: string) {
  return request.call({
    url: `/organization/${organizationId}/program/code`,
    method: 'GET',
  });
}

export async function createCombinedProgram(
  organizationId: string,
  data: ICreateCombinedProgramData
) {
  return request.call({
    url: `/organization/${organizationId}/program/combined`,
    method: 'POST',
    data,
  });
}

export async function cloneProgram(organizationId: string, programId: string) {
  return request.call({
    url: `/organization/${organizationId}/program/${programId}/clone`,
    method: 'GET',
  });
}

export interface IProgramFilterType {
  order?: string; // name|<asc|desc>
  include?: string;
  page?: number;
}

export async function getAllPrograms(
  organizationId: string,
  filter?: IProgramFilterType
) {
  return request.call({
    url: `/organization/${organizationId}/program`,
    method: 'GET',
    params: {
      include: 'groups,programProgress',
      ...(filter || {}),
    },
  });
}

export async function getAllProgramsWithoutPagination(organizationId: string) {
  return request.call({
    url: `/organization/${organizationId}/program/all`,
    method: 'GET',
  });
}

export async function getAllProgramsForAuthUser(
  organizationId: string,
  filter?: IProgramFilterType
) {
  return request.call({
    url: `/organization/${organizationId}/program/for-auth-users`,
    method: 'GET',
    params: {
      ...(filter || {}),
    },
  });
}

export interface IGroupsFilterType {
  order?: string; // name|<asc|desc>
  page?: number;
}

export async function getProgramGroups(
  organizationId: string,
  programId: string,
  filter?: IGroupsFilterType
) {
  return request.call({
    url: `/organization/${organizationId}/program/${programId}/group`,
    method: 'GET',
    params: {
      include: 'goal,program,books,groupProgress,questions',
      ...(filter || {}),
    },
  });
}

export interface IUpdateProgramData {
  name: string;
  reading_log: 0 | 1;
}
export async function updateProgram(
  organizationId: string,
  programId: string,
  data: IUpdateProgramData
) {
  return request.call({
    url: `/organization/${organizationId}/program/${programId}`,
    method: 'PATCH',
    data,
  });
}

export async function sendEmailCode(code: string, toAddr: string) {
  return request.call({
    url: `/mail/pcode`,
    method: 'POST',
    data: {
      code,
      to_addr: toAddr,
    },
  });
}

export async function deleteProgram(organizationId: string, programId: string) {
  return request.call({
    url: `/organization/${organizationId}/program/${programId}`,
    method: 'DELETE',
  });
}

export async function deleteGroupInProgram(
  organizationId: string,
  programId: string,
  groupId: string
) {
  return request.call({
    url: `organization/${organizationId}/program/${programId}/group/${groupId}`,
    method: 'DELETE',
  });
}

export async function searchProgram(
  organizationId: string,
  searchText: string
) {
  return request.call({
    url: `organization/${organizationId}/program/search`,
    method: 'GET',
    params: {
      name: searchText,
    },
  });
}

export interface CombinedGroupData {
  group: {
    name: string;
  };
  goal: {
    start_date: string;
    end_date: string;
    value: string;
    metric_id: string;
    interval_id: string;
  };
  book: [
    {
      id: string;
    }
  ];
}

export async function createCombinedGroup(
  organizationId: string,
  programId: string,
  data: CombinedGroupData
) {
  return request.call({
    url: `organization/${organizationId}/program/${programId}/group/combined`,
    method: 'POST',
    data,
  });
}

export async function updateCombinedGroup(
  organizationId: string,
  programId: string,
  groupId: string,
  data: CombinedGroupData
) {
  return request.call({
    url: `organization/${organizationId}/program/${programId}/group/${groupId}/combined`,
    method: 'PATCH',
    data,
  });
}

export async function searchProgramGroups(
  organizationId: string,
  programId: string,
  searchText: string
) {
  return request.call({
    url: `/organization/${organizationId}/program/${programId}/group/search`,
    method: 'GET',
    params: {
      name: searchText,
    },
  });
}

export interface GetAllReadersParam {
  organizationId: string;
  programId: string;
  groupId: string;
  order?: string; // name|<asc|desc>
}

export async function getAllReaders(data: GetAllReadersParam) {
  const { organizationId, programId, groupId } = data;
  return request.call({
    url: `/organization/${organizationId}/program/${programId}/group/${groupId}`,
    method: 'GET',
    params: {
      include: 'goal.users,goal.lastEntry,books,readerProgress,questions',
      order: data.order || '',
    },
  });
}

export async function deleteGroupReader(userId: string, goalId: string) {
  return request.call({
    url: `/user/${userId}/goal/${goalId}`,
    method: 'DELETE',
  });
}

export interface CreateAdvanceProgramData {
  program: {
    name: string;
    reading_log: 0 | 1;
  };
  group: [{ name: string }];
  goal: [
    {
      start_date: string;
      end_date: string;
      metric_id: string;
      interval_id?: string;
      value?: number;
    }
  ];
}

export async function createAdvanceProgram(
  organizationId: string,
  data: CreateAdvanceProgramData
) {
  return request.call({
    url: `/organization/${organizationId}/program/advanced`,
    method: 'POST',
    data,
  });
}

export interface IAdvanceProgramData {
  program: {
    name: string;
    reading_log: 0 | 1;
  };
  group: [{ name: string }];
  goal: [
    {
      start_date: string;
      end_date: string;
      metric_id: string;
      interval_id?: string;
      value?: number;
    }
  ];
}

export async function updateAdvanceProgram(
  organizationId: string,
  programdId: string,
  data: IAdvanceProgramData
) {
  return request.call({
    url: `/organization/${organizationId}/program/${programdId}/advanced`,
    method: 'PATCH',
    data,
  });
}

export async function getProgramAwards(
  organizationId: string,
  programId: string
) {
  return request.call({
    url: `/organization/${organizationId}/program/${programId}/awards`,
    method: 'GET',
  });
}

export async function getGroupAwards(
  organizationId: string,
  programId: string,
  groupIds: string[]
) {
  const filter = {
    group_id: groupIds,
  };
  return request.call({
    url: `/organization/${organizationId}/program/${programId}/awards`,
    method: 'GET',
    params: {
      ...filter,
    },
  });
}

export interface IAwardData {
  goal_id: string;
  name: string;
  description?: string;
  avatar?: string;
  avatar_url?: string;
}

export async function createAwards(userId: string, data: IAwardData) {
  return request.call({
    url: `/user/${userId}/award/add`,
    method: 'POST',
    data,
  });
}

export async function updateAwards(
  userId: string,
  awardsId: string,
  data: IAwardData
) {
  return request.call({
    url: `/user/${userId}/award/${awardsId}`,
    method: 'POST',
    data,
  });
}

export async function getAwardsPreview(userId: string, awardsId: string) {
  return request.call({
    url: `/user/${userId}/award/${awardsId}`,
    method: 'GET',
  });
}

export async function restoreDefaultAwards(userId: string, awardsId: string) {
  return request.call({
    url: `/user/${userId}/award/${awardsId}/restore`,
    method: 'GET',
  });
}

export async function updateAwardsAvatar(
  organizationId: string,
  programId: string,
  groupId: string,
  awardId: string,
  data: any
) {
  return request.call({
    url: `/organization/${organizationId}/program/${programId}/group/${groupId}/award/${awardId}/avatar`,
    method: 'POST',
    data,
  });
}
export async function deleteAwardsAvatar(
  organizationId: string,
  programId: string,
  groupId: string,
  awardId: string
) {
  return request.call({
    url: `/organization/${organizationId}/program/${programId}/group/${groupId}/award/${awardId}/avatar`,
    method: 'DELETE',
  });
}

export async function getProgramLeaderboard(
  organizationId: string,
  programId: string,
  filter: any
) {
  return request.call({
    url: `/organization/${organizationId}/program/${programId}/leaderboard`,
    method: 'GET',
    params: {
      ...filter,
    },
  });
}

export async function getGroupLeaderboard(
  organizationId: string,
  programId: string,
  groupId: string,
  filter: any
) {
  return request.call({
    url: `/organization/${organizationId}/program/${programId}/group/${groupId}/leaderboard`,
    method: 'GET',
    params: {
      ...filter,
    },
  });
}

export interface ISendEmailToParticipantsData {
  subject: string;
  pCode: any;
  body: string;
  to_addr: string[];
}
export async function sendEmailToParticipants(
  data: ISendEmailToParticipantsData
) {
  return request.call({
    url: `/mail/outreach`,
    method: 'POST',
    data,
  });
}
