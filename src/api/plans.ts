import request from './request';

export async function getBraintreeClientToken() {
  return request.call({
    url: '/payments/client/token',
    method: 'GET',
  });
}
export async function getALlPlans(filterData?: any) {
  return request.call({
    url: '/payments/plans',
    method: 'GET',
    params: {
      ...filterData,
    },
  });
}
export async function createSubscription(data: any) {
  return request.call({
    url: '/payments/create/subscription',
    method: 'POST',
    data,
  });
}
export async function createSubscriptionWithBraintree(data: any) {
  return request.call({
    url: '/payments/create/subscriptionV2',
    method: 'POST',
    data,
  });
}
export async function updateCreditCardInfo(data: any) {
  return request.call({
    url: '/payments/update/credit-card-info',
    method: 'POST',
    data,
  });
}
export async function changeSubscription(planId: string) {
  return request.call({
    url: '/payments/change/subscription',
    method: 'POST',
    data: {
      plan_id: planId,
    },
  });
}
export async function cancelSubscription(data: any) {
  return request.call({
    url: '/payments/cancel/subscription',
    method: 'POST',
    data,
  });
}
