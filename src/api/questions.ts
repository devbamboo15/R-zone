import request from './request';

// Get SignUp Questions
export async function getSignUpQuestions() {
  return request.call({
    url: `/questions`,
    method: 'GET',
  });
}

// Get User Questions
export async function getUserQuestions(userId: number | string) {
  return request.call({
    url: `/questions/user/${userId}`,
    method: 'GET',
  });
}
