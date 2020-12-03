import request from './request';

// Search Goal

export async function searchGoalCode(codeValue: string) {
  return request.call({
    url: `/me/goal/search`,
    method: 'GET',
    params: {
      code: codeValue,
    },
  });
}

// Join Goal

export async function goalJoin(id: string | string[], readerId?: string) {
  const url = readerId ? `/user/${readerId}/goal/` : `/me/goal/`;
  return request.call({
    url,
    method: 'POST',
    data: {
      id,
    },
  });
}

// Leave Goal

export async function goalLeave(id: string) {
  return request.call({
    url: `/me/goal/${id}/`,
    method: 'DELETE',
  });
}

// Get reader progress with timeline

export async function getProgress() {
  return request.call({
    url: `/me/progress`,
    method: 'GET',
  });
}

// Create New Reading Entry

interface INewReadingEntryData {
  date: string;
  value: number;
}

export async function createReadingEntry(
  userId: string,
  goalId: string,
  data: INewReadingEntryData,
  isV2?: boolean
) {
  const url = `/user/${userId}/goal/${goalId}/entry${isV2 ? '/v2' : ''}`;
  return request.call({
    url,
    method: 'POST',
    data,
  });
}

// Add Bulk Entry

interface IBulkEntryData {
  date: string;
  value: number;
  user_id: number | string;
}

export async function addBulkEntry(
  orgId: string,
  programId: string,
  groupId: string,
  data: INewReadingEntryData[]
) {
  return request.call({
    url: `/organization/${orgId}/program/${programId}/group/${groupId}/bulk-entry`,
    method: 'POST',
    data,
  });
}
