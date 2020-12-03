import { compile } from 'path-to-regexp';
import isEmpty from 'lodash/isEmpty';

// This function process any url/path given path regex and config options
// - pathRegex: is the regex by which we can construct actual url, format is similar to react-router route urls
// - params: if params is empty it will return plain path regex otherwise it will return compiled path with actual parameter values
// For e.g. when we define react-router routes , we need path regex with parameter placement holder
// so at that time don't need to pass params which will directly return pathRegex
// Suppose in case we need actual url to redirect at that time pass parameters values, it will return actual url to redirect
const processURL = (pathRegex: string, params: any) => {
  if (isEmpty(params)) {
    return pathRegex;
  }
  const toPath = compile(pathRegex);
  return toPath(params || {}, { encode: value => value });
};

const abstractURL = (pathRegex: string) => (options?: any) =>
  processURL(pathRegex, options);

export default {
  HOME: abstractURL('/'),

  // AUTH
  SANDBOX_LOGIN: abstractURL('/sandbox/login'),
  LOGIN: abstractURL('/login'),
  SIGNUP: abstractURL('/signup'),
  SIGNUP_CONFIRMATION: abstractURL('/signup-confirmation'),
  THANKS: abstractURL('/thanks'),
  SETUP: abstractURL('/setup/:role'),
  REGISTER: abstractURL('/register'),
  FORGET_PASSWORD: abstractURL('/forget-password'),
  RESET_PASSWORD: abstractURL('/reset-password'),
  // PROGRESSBADGES
  PROGRESS_BADGES: abstractURL('/progress-badges'),
  PROGRESS_BADGES_TAB: abstractURL('/progress-badges/:tab'),
  // SHARE/PROMOTE
  SHARE: abstractURL('/share'),
  SHARE_TAB: abstractURL('/share/:tab'),
  // MY ACCOUNT
  MYACCOUNT: abstractURL('/my-account'),
  MYACCOUNT_TAB: abstractURL('/my-account/:tab'),
  ADD_AUTHORIZED_USER: abstractURL('/add-authorized-user'),
  EDIT_AUTHORIZED_USER: abstractURL('/edit-authorized-user/:userid'),
  // PROGRAMS
  READER_DETAIL: abstractURL(
    '/organizer/programs/:programId/groups/:groupId/readers/:readerId'
  ),
  PROGRAMS: abstractURL('/organizer/programs'),
  PROGRAMS_AWARDS: abstractURL('/organizer/programs/:programId/awards'),
  PROGRAMS_LEADERBOARD: abstractURL(
    '/organizer/programs/:programId/leaderboard'
  ),
  PROGRAMS_AWARDS_PREVIEW: abstractURL(
    '/organizer/programs/:programId/awards/preview'
  ),
  GROUPS: abstractURL('/organizer/programs/:programId/groups'),
  GROUPS_ADVANCED: abstractURL(
    '/organizer/programs/:programId/groups/advanced'
  ),
  GROUPS_LEADERBOARD: abstractURL(
    '/organizer/programs/:programId/groups/leaderboard'
  ),
  GROUPS_AWARDS: abstractURL(
    '/organizer/programs/:programId/groups/:groupId/awards'
  ),
  READERS_AWARDS: abstractURL(
    '/organizer/programs/:programId/groups/:groupId/readers/awards/list'
  ),
  CREATE_GROUP: abstractURL('/organizer/programs/:programId/groups/create'),
  READERS_LEADERBOARD: abstractURL(
    '/organizer/programs/:programId/groups/:groupId/readers/leaderboard/list'
  ),
  READERS: abstractURL(
    '/organizer/programs/:programId/groups/:groupId/readers'
  ),
  CREATE_PROGRAM: abstractURL('/organizer/programs/create'),
  CREATE_PROGRAM_ADVANCED: abstractURL('/organizer/programs/create/advanced'),
  UPDATE_PROGRAM_ADVANCED: abstractURL(
    '/organizer/programs/advanced/:programId'
  ),
  AWARDS: abstractURL('/organizer/programs/readers/:id/awards'),
  AWARDS_PREVIEW: abstractURL('/organizer/programs/readers/:id/awards/preview'),

  // Manage Readers
  MANAGE_READERS: abstractURL('/readers/manage'),

  // INVITE READERS
  INVITE_READERS: abstractURL('/invite-readers'),
  INVITE_READERS_TAB: abstractURL('/invite-readers/:tab'),
  // REPORTS
  REPORTS: abstractURL('/reports'),
  ONE_LAST_THING: abstractURL('/one-last-thing'),
  OLD_PRODUCT_APP:
    process.env.PLATFORM === 'beta'
      ? 'https://app.readerzone.com/beta'
      : process.env.PLATFORM === 'staging'
      ? 'https://app.staging-old.readerzone.com/beta'
      : 'https://app.readerzone.getventive.com/beta',
  PRICING_PAGE:
    process.env.PLATFORM === 'beta'
      ? 'https://readerzone.com/pricing'
      : process.env.PLATFORM === 'staging'
      ? 'https://readerzone-staging.webflow.io/pricing'
      : 'https://readerzone.webflow.io/pricing',
  SITE_HOMEPAGE:
    process.env.PLATFORM === 'beta'
      ? 'https://readerzone.com'
      : process.env.PLATFORM === 'staging'
      ? 'https://readerzone-staging.webflow.io'
      : 'https://readerzone.webflow.io',
};
