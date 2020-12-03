import idx from 'idx';
import * as Api from 'src/api';
import Types from 'src/store/types/plans';
import toast from 'src/helpers/Toast';
import { fetchMeData, resetRegisterSkeepOrg } from 'src/store/actions/auth';
import get from 'lodash/get';

export const createSubscriptionWithBraintree = (
  data: any,
  showToast?: boolean
) => async (dispatch: CustomDispatch) => {
  try {
    dispatch({ type: Types.CREATE_SUBSCRIPTION_WITH_BRAINTREE_REQUEST });
    const res = await Api.createSubscriptionWithBraintree(data);
    const errorMessage = get(res, 'error');
    if (errorMessage) {
      dispatch({
        type: Types.CREATE_SUBSCRIPTION_WITH_BRAINTREE_ERROR,
        payload: errorMessage,
      });
    } else {
      dispatch({
        type: Types.CREATE_SUBSCRIPTION_WITH_BRAINTREE_SUCCESS,
        payload: idx(res, x => x.data),
      });
      dispatch(fetchMeData());
      if (showToast) {
        toast.success('Created subscription success');
      }
    }
  } catch (error) {
    dispatch({
      type: Types.CREATE_SUBSCRIPTION_WITH_BRAINTREE_ERROR,
      payload: error.message,
    });
  }
};
export const getAllPlans = (filterParam?: any) => async (
  dispatch: CustomDispatch
) => {
  try {
    dispatch({ type: Types.GET_PLANS });
    const res = await Api.getALlPlans(filterParam);
    dispatch({
      type: Types.GET_PLANS_SUCCESS,
      payload: idx(res, x => x.data),
    });
  } catch (error) {
    dispatch({
      type: Types.GET_PLANS_ERROR,
      payload: error.message,
    });
  }
};
export const createSubcription = (data: any) => async (
  dispatch: CustomDispatch
) => {
  try {
    dispatch({ type: Types.CREATE_SUBSCRIPTION_REQUEST });
    const res = await Api.createSubscription(data);
    const resData = get(res, 'data');
    if (typeof resData !== 'string') {
      dispatch({
        type: Types.CREATE_SUBSCRIPTION_SUCCESS,
        payload: res,
      });
      dispatch(fetchMeData());
      dispatch(resetRegisterSkeepOrg());
      toast.success('Created subscription success');
    } else {
      dispatch({
        type: Types.CREATE_SUBSCRIPTION_ERROR,
        payload: resData,
      });
      toast.error(resData);
    }
  } catch (error) {
    dispatch({
      type: Types.CREATE_SUBSCRIPTION_ERROR,
      payload: error.message,
    });
    toast.error(error.message);
  }
};
export const updateCreditCardInfo = (data: any, cb?: any) => async (
  dispatch: CustomDispatch
) => {
  try {
    dispatch({ type: Types.UPDATE_CREDIT_CARD_REQUEST });
    const res = await Api.updateCreditCardInfo(data);
    dispatch({
      type: Types.UPDATE_CREDIT_CARD_SUCCESS,
      payload: res,
    });
    toast.success('Updated credit card information success');
    if (cb) cb();
  } catch (error) {
    dispatch({
      type: Types.UPDATE_CREDIT_CARD_ERROR,
      payload: error.message,
    });
    toast.error(error.message);
  }
};
export const changeSubcription = (planId: string, cb: any) => async (
  dispatch: CustomDispatch
) => {
  try {
    dispatch({ type: Types.CHANGE_SUBSCRIPTION_REQUEST });
    const res = await Api.changeSubscription(planId);
    dispatch({
      type: Types.CHANGE_SUBSCRIPTION_SUCCESS,
      payload: res,
    });
    dispatch(fetchMeData());
    toast.success('Changed subscription success');
    if (cb) cb();
  } catch (error) {
    dispatch({
      type: Types.CHANGE_SUBSCRIPTION_ERROR,
      payload: error.message,
    });
    toast.error(error.message);
  }
};
export const cancelSubscription = (data: any, cb: any) => async (
  dispatch: CustomDispatch
) => {
  try {
    dispatch({ type: Types.CANCEL_SUBSCRIPTION_REQUEST });
    const res = await Api.cancelSubscription(data);
    dispatch({
      type: Types.CANCEL_SUBSCRIPTION_SUCCESS,
      payload: res,
    });
    dispatch(fetchMeData());
    toast.success('Cancelled subscription success');
    if (cb) cb();
  } catch (error) {
    dispatch({
      type: Types.CANCEL_SUBSCRIPTION_ERROR,
      payload: error.message,
    });
    toast.error(error.message);
  }
};
export const setFirstPayment = (firstPayment: boolean) => (
  dispatch: CustomDispatch
) => {
  dispatch({ type: Types.SET_FIRST_PAYMENT, payload: firstPayment });
};
