import toast from 'src/helpers/Toast';
import { toast as BaseToast } from 'react-toastify';
import {
  login,
  IRegisterParam,
  IRegisterSkeepOrgParam,
  register,
  updateAccount,
  IUpdateAccountParam,
  me,
  cancelAccount,
  IResetPasswordParam,
  forgetPassword,
  resetPassword,
  userSocialDetail,
  checkResetPassword,
  sandboxLogin,
  checkSignupToken,
  checkExistingEmail,
  registerSkeepOrganization,
  meBetaOff,
} from 'src/api';
import history from 'src/helpers/history';
import get from 'lodash/get';
import set from 'lodash/set';
import urls from 'src/helpers/urls';
import { Role } from 'src/screens/Signup/Steps/ZoneType';
import { setSandboxLogin } from 'src/helpers/sessionStorage';
import idx from 'idx';
import * as queryString from 'query-string';
import Types from '../types/auth';
import PlanTypes from '../types/plans';
import { persistor } from '../index';
import { getAuthorizedUser } from './organizer/users';

export const doLogin = (
  email: string,
  password: string,
  captchaToken?: string,
  cb?: any,
  ref?: string
) => async (dispatch: CustomDispatch) => {
  try {
    dispatch({ type: Types.LOGIN_REQUEST });
    const res = await login(email, password, captchaToken);
    dispatch({
      type: Types.LOGIN_SUCCESS,
      payload: { ...res },
    });
    dispatch(fetchMeData(cb, ref));
  } catch (error) {
    // toast.error(error.message);
    dispatch({ type: Types.LOGIN_ERROR, payload: error.message });
  }
};

export const doLoginSkipApiCall = (res: any, cb?: any, ref?: string) => async (
  dispatch: CustomDispatch
) => {
  try {
    dispatch({
      type: Types.LOGIN_SUCCESS,
      payload: { ...res },
    });
    dispatch(fetchMeData(cb, ref));
  } catch (error) {
    // toast.error(error.message);
    dispatch({ type: Types.LOGIN_ERROR, payload: error.message });
  }
};

const isUnOrganizerPath = path => {
  let check = false;
  ['reader', 'parent'].map(r => {
    if (path === urls.SETUP({ role: r })) {
      check = true;
    }
    return true;
  });
  return check;
};
export const fetchMeData = (cb?: any, ref?: string) => async (
  dispatch: CustomDispatch
) => {
  try {
    dispatch({
      type: Types.UPDATE_ACCOUNT_REQUEST,
    });
    const params = queryString.parse(get(history, 'location.search', ''));
    const searchRef = get(params, 'ref', '') || ref;
    const res = await me(searchRef);
    const roles = get(res, 'data.relationships.roles.data');
    const isOrganizer = roles.find(item => item.id === Role.ORGANIZER);
    const pathName = get(history, 'location.pathname');
    // We do not override authorize user information in Edit Authorize User page
    if (pathName.indexOf('edit-authorized-user') !== -1) {
      const profileId = get(res, 'data.id');
      dispatch(getAuthorizedUser(profileId));
    }
    if (!isOrganizer) {
      const isReader = roles.find(item => item.id === Role.READER);
      const dataAttributes = get(res, 'data.attributes') || {};
      dispatch({
        type: Types.UPDATE_ACCOUNT_SUCCESS,
        payload: {
          ...res,
          data: {
            ...res.data,
            attributes: {
              ...dataAttributes,
            },
          },
        },
      });
      if (cb) cb();
      if (!isUnOrganizerPath(get(history, 'location.pathname', ''))) {
        history.replace(
          `${urls.SETUP({
            role: isReader ? 'reader' : 'parent',
          })}`
        );
      }
    } else {
      const organization = get(res, 'included', []).find(
        ({ type }) => type === 'organization'
      );
      const subscription = get(res, 'included', []).find(
        ({ type }) => type === 'subscription'
      );
      const dataAttributes = get(res, 'data.attributes') || {};
      dataAttributes.organization = organization
        ? organization.attributes
        : null;
      dataAttributes.subscription = subscription
        ? subscription.attributes
        : null;
      dispatch({
        type: Types.UPDATE_ACCOUNT_SUCCESS,
        payload: {
          ...res,
          data: {
            ...res.data,
            attributes: dataAttributes,
          },
        },
      });
      if (cb) cb();
    }
  } catch (error) {
    dispatch({ type: Types.UPDATE_ACCOUNT_ERROR, payload: error.message });
    if (cb) cb();
  }
};

export const doLogout = (cb?: any) => async (dispatch: CustomDispatch) => {
  window.stop();
  await persistor.purge();
  dispatch({ type: Types.LOGOUT });
  if (cb && typeof cb === 'function') cb();
};

export const doCancelAccount = () => async (dispatch: CustomDispatch) => {
  await cancelAccount();
  dispatch(doLogout());
};

export const doRegister = (
  data: IRegisterParam,
  preSelectedPlanId = null,
  numberOfReaders = 0
) => async (dispatch: CustomDispatch) => {
  try {
    dispatch({ type: Types.REGISTER_REQUEST });
    const res = await register(data);

    // only organizer role is allowed access to Panel
    if (data.role === Role.ORGANIZER) {
      dispatch(
        doLoginSkipApiCall(res.data.attributes, () => {
          dispatch({
            type: Types.REGISTER_SUCCESS,
            payload: { ...res, numberOfReaders },
          });
          if (preSelectedPlanId) {
            if (numberOfReaders === 20) {
              history.push(urls.PROGRAMS());
            } else {
              history.replace(
                `${urls.MYACCOUNT_TAB({
                  tab: 'payments',
                })}?pre_selected_planid=${preSelectedPlanId}`
              );
            }
          } else if (numberOfReaders === 20) {
            // then dont show ONE_LAST_THING page, redirect user to programs
            history.push(urls.PROGRAMS());
          } else {
            history.push(urls.ONE_LAST_THING());
          }
        })
      );
    } else {
      set(res, 'data.attributes.password', data.password);
      dispatch({ type: Types.REGISTER_SUCCESS, payload: res });
      history.replace(`${urls.THANKS()}?role=${data.role}`);
    }
  } catch (error) {
    dispatch({ type: Types.REGISTER_ERROR, payload: '' });
    const errorStr = [];
    for (const key in error) {
      if (error.hasOwnProperty(key)) {
        errorStr.push(error[key]);
      }
    }
    toast.error(errorStr.join('\n'), { autoClose: 15000 });
  }
};

export const resetRegister = (cb?: any) => (dispatch: CustomDispatch) => {
  dispatch({ type: Types.REGISTER_RESET });
  if (cb) cb();
};

export const doUpdateAccount = (
  data: IUpdateAccountParam,
  cb?: Function
) => async (dispatch: CustomDispatch) => {
  try {
    dispatch({ type: Types.UPDATE_ACCOUNT_REQUEST });
    const res = await updateAccount(data);
    toast.success('Account Updated Successfully');
    dispatch({
      type: Types.UPDATE_ACCOUNT_SUCCESS,
      payload: {
        data: {
          attributes: {
            first_name: res.data.attributes.firstName,
            last_name: res.data.attributes.lastName,
            email: res.data.attributes.email,
            password_old: data.oldPassword,
            password: data.newPassword,
            password_confirmation: data.confirmPassword,
            role: data.role,
            notification_preferences: data.notificationPreferences,
            facebook: res.data.attributes.facebook,
            twitter: res.data.attributes.twitter,
            instagram: res.data.attributes.instagram,
            snapchat: res.data.attributes.snapchat,
            organization: data.organization,
          },
        },
      },
    });
    dispatch(fetchMeData());
    if (cb) cb();
  } catch (error) {
    dispatch({ type: Types.UPDATE_ACCOUNT_ERROR, payload: error.message });
  }
};

export const doForgetPassword = (email: string) => async (
  dispatch: CustomDispatch
) => {
  try {
    dispatch({ type: Types.FORGET_PASSWORD_REQUEST });
    await forgetPassword(email);
    toast.success('Email reset password was sent!');

    dispatch({ type: Types.FORGET_PASSWORD_SUCCESS });
  } catch (error) {
    dispatch({ type: Types.FORGET_PASSWORD_ERROR, payload: error.message });
  }
};

export const doResetPassword = (data: IResetPasswordParam) => async (
  dispatch: CustomDispatch
) => {
  try {
    dispatch({ type: Types.RESET_PASSWORD_REQUEST });
    await resetPassword(data);
    toast.success('Reset password successfully!');
    dispatch({ type: Types.RESET_PASSWORD_SUCCESS });

    history.replace(urls.LOGIN());
  } catch (error) {
    dispatch({ type: Types.RESET_PASSWORD_ERROR, payload: error.message });
  }
};

export const doCheckResetPassword = (email: string) => async (
  dispatch: CustomDispatch
) => {
  try {
    dispatch({ type: Types.CHECK_RESET_PASSWORD_REQUEST });
    const res = await checkResetPassword(email);
    dispatch({ type: Types.CHECK_RESET_PASSWORD_SUCCESS, payload: res });
  } catch (error) {
    dispatch({
      type: Types.CHECK_RESET_PASSWORD_ERROR,
      payload: error.message,
    });
  }
};

export const getUserSocialDetail = (
  token: string,
  tokenSecret: string,
  provider: string
) => async (dispatch: CustomDispatch) => {
  dispatch({ type: Types.USER_SOCIAL_REQUEST });

  try {
    const res = await userSocialDetail(token, tokenSecret, provider);
    await dispatch({ type: Types.USER_SOCIAL_SUCCESS, payload: res });
    await dispatch(doUpdateAccount({ twitter: JSON.stringify(res) }));

    history.replace(urls.MYACCOUNT_TAB({ tab: 'social_media' }));
  } catch (error) {
    dispatch({ type: Types.USER_SOCIAL_ERROR, payload: error.message });
  }
};

export const resetSandboxLogin = () => async (dispatch: CustomDispatch) => {
  dispatch({
    type: Types.RESET_SANDBOX_LOGIN_INFO,
  });
};

export const doSandboxLogin = () => async (dispatch: CustomDispatch) => {
  try {
    toast.success('Please wait, while we set up your test demo...', {
      progress: 1,
    });
    dispatch({
      type: Types.SANDBOX_LOGIN_REQUEST,
    });
    const data = await sandboxLogin();
    dispatch({
      type: Types.SANDBOX_LOGIN_SUCCESS,
      payload: data,
    });
    BaseToast.dismiss();
    setSandboxLogin(idx(data, x => x.access_token));
    await dispatch(fetchMeData());
    history.push(urls.PROGRAMS());
  } catch (error) {
    dispatch({
      type: Types.SANDBOX_LOGIN_FAILURE,
      payload: error.toString(),
    });
  }
};

export const checkSignuptoken = (
  token: string,
  email: string,
  cb?: Function
) => async (dispatch: CustomDispatch) => {
  try {
    dispatch({
      type: Types.CHECK_SIGNUP_TOKEN_REQUEST,
    });
    const data = await checkSignupToken(token, email);
    dispatch({
      type: Types.CHECK_SIGNUP_TOKEN_SUCCESS,
      payload: data,
    });
    if (cb) cb();
  } catch (error) {
    dispatch({
      type: Types.CHECK_SIGNUP_TOKEN_ERROR,
      payload: error,
    });
  }
};

export const checkSignupEmail = (email: string, cb?: Function) => async (
  dispatch: CustomDispatch
) => {
  try {
    dispatch({
      type: Types.CHECK_EXISTING_EMAIL_REQUEST,
    });
    const data = await checkExistingEmail(email);
    dispatch({
      type: Types.CHECK_EXISTING_EMAIL_SUCCESS,
      payload: get(data, 'status'),
    });
    if (cb) cb();
  } catch (error) {
    dispatch({
      type: Types.CHECK_EXISTING_EMAIL_ERROR,
      payload: error,
    });
  }
};

export const doRegisterSkeepOrg = (
  data: IRegisterSkeepOrgParam,
  preSelectedPlanId,
  numberOfReaders = 20,
  cb?: any
) => async (dispatch: CustomDispatch) => {
  try {
    dispatch({ type: Types.REGISTER_SKEEP_ORG_REQUEST });
    const res = await registerSkeepOrganization(data);
    if (cb) {
      dispatch(
        doLoginSkipApiCall(res.data.attributes, () => {
          dispatch({
            type: Types.REGISTER_SKEEP_ORG_SUCCESS,
            payload: { ...res, numberOfReaders, preSelectedPlanId },
          });
          cb();
        })
      );
    } else {
      // only organizer role is allowed access to Panel
      dispatch(
        doLoginSkipApiCall(res.data.attributes, () => {
          dispatch({
            type: Types.REGISTER_SKEEP_ORG_SUCCESS,
            payload: { ...res, numberOfReaders, preSelectedPlanId },
          });
          if (numberOfReaders === 20) {
            dispatch({
              type: PlanTypes.SET_FIRST_PAYMENT,
              payload: true,
            });
          }
          // } else {
          //   history.replace(
          //     `${urls.MYACCOUNT_TAB({
          //       tab: 'payments',
          //     })}?pre_selected_planid=${preSelectedPlanId}`
          //   );
          // }
        })
      );
    }
  } catch (error) {
    dispatch({ type: Types.REGISTER_SKEEP_ORG_ERROR, payload: '' });
    let errorStr = ``;
    for (const key in error) {
      if (error.hasOwnProperty(key)) {
        errorStr += error[key].join('\n');
      }
    }
    toast.error(errorStr);
  }
};

export const resetRegisterSkeepOrg = (cb?: any) => (
  dispatch: CustomDispatch
) => {
  dispatch({ type: Types.REGISTER_SKEEP_ORG_RESET });
  if (cb && typeof cb === 'function') cb();
};

export const doMeBetaOff = () => async (dispatch: CustomDispatch) => {
  try {
    dispatch({ type: Types.ME_BETA_OFF_REQUEST });
    await meBetaOff();
    dispatch(doLogout());
    dispatch({ type: Types.ME_BETA_OFF_SUCCESS });
    window.location.href = urls.OLD_PRODUCT_APP;
  } catch (error) {
    dispatch({ type: Types.ME_BETA_OFF_ERROR, payload: error });
    let errorStr = ``;
    for (const key in error) {
      if (error.hasOwnProperty(key)) {
        errorStr += error[key].join('\n');
      }
    }
    toast.error(errorStr);
  }
};
