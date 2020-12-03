import request from './request';

export async function login(
  username: string,
  password: string,
  captchaToken?: string
) {
  return request.call({
    url: '/oauth/token/',
    method: 'POST',
    data: {
      username,
      password,
      grant_type: 'password',
      scope: '*',
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      captcha_token: captchaToken,
    },
  });
}

export interface IOrganizationParam {
  name: string;
  country: string;
  state: string;
  city: string;
  postal_code: string;
  address: string;
  phone: string;
  organization_type: string;
}

export interface IRegisterParam {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
  role?: string;
  token?: string;
  captchaToken?: string;
  organization?: {
    name: string;
    country: string;
    state: string;
    city: string;
    postal_code: string;
    address: string;
    phone: string;
    organization_type: string;
  };
  invitation_email?: string;
}

export async function register(data: IRegisterParam) {
  return request.call({
    url: '/auth/register/',
    method: 'POST',
    data: {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
      password_confirmation: data.confirmPassword,
      terms: data.terms,
      role: data.role,
      organization: data.organization,
      token: data.token,
      invitation_email: data.invitation_email,
      captcha_token: data.captchaToken,
    },
  });
}

export interface IUpdateAccountParam {
  firstName?: string;
  lastName?: string;
  email?: string;
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  role?: string;
  notificationPreferences?: {
    opt_out: boolean;
    notify_if_changes?: boolean;
    notify_if_milestones?: boolean;
    notify_if_inactive?: boolean;
  };
  facebook?: string;
  twitter?: string;
  instagram?: string;
  snapchat?: string;
  organization?: IOrganizationParam;
}

export async function updateAccount(data: IUpdateAccountParam) {
  return request.call({
    url: '/me/',
    method: 'PATCH',
    data: {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password_old: data.oldPassword,
      password: data.newPassword,
      password_confirmation: data.confirmPassword,
      role: data.role,
      notification_preferences: data.notificationPreferences,
      facebook: data.facebook,
      twitter: data.twitter,
      instagram: data.instagram,
      snapchat: data.snapchat,
      organization: data.organization,
    },
  });
}

export async function me(ref) {
  let params = {};
  if (ref) {
    params = {
      ref,
    };
  }
  return request.call({
    url: '/me/',
    method: 'GET',
    params,
  });
}

export async function cancelAccount() {
  return request.call({
    url: '/me/',
    method: 'DELETE',
  });
}

export async function forgetPassword(email: string) {
  return request.call({
    url: '/auth/forgot',
    method: 'POST',
    data: {
      email,
    },
  });
}

export interface IResetPasswordParam {
  token: string;
  password: string;
  password_confirmation: string;
  email: string;
}

export async function resetPassword(data: IResetPasswordParam) {
  return request.call({
    url: '/auth/reset',
    method: 'POST',
    data: {
      token: data.token,
      email: data.email,
      password: data.password,
      password_confirmation: data.password_confirmation,
    },
  });
}

export async function checkResetPassword(email: string) {
  return request.call({
    url: `/auth/is-reset?email=${email}`,
    method: 'GET',
  });
}

export async function userSocialDetail(
  token: string,
  tokenSecret: string,
  provider: string
) {
  return request.call({
    url: `/user_social/${provider}/${token}/${tokenSecret}`,
    method: 'GET',
  });
}

export async function sandboxLogin() {
  return request.call({
    url: '/sandbox/generate',
    method: 'POST',
    data: {},
  });
}

export async function checkSignupToken(token: string, email: string) {
  return request.call({
    url: `/verify/user?email=${email}&token=${token}`,
    method: 'GET',
  });
}

export async function checkExistingEmail(email: string) {
  return request.call({
    url: `/verify/email?email=${email}`,
    method: 'GET',
  });
}

export interface IRegisterSkeepOrgParam {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  captchaToken?: string;
  organization?: {
    name: string;
    organization_type: string;
  };
}

export async function registerSkeepOrganization(data: IRegisterSkeepOrgParam) {
  return request.call({
    url: '/auth/register/',
    method: 'POST',
    data: {
      webflow: 1,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
      password_confirmation: data.confirmPassword,
      organization: data.organization,
      terms: true,
      role: 'organizer',
      captcha_token: data.captchaToken,
    },
  });
}

export async function meBetaOff() {
  return request.call({
    url: '/me/beta/off',
    method: 'POST',
  });
}
