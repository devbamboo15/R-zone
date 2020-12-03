export default {
  FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
  INSTAGRAM_CLIENT_ID: process.env.INSTAGRAM_CLIENT_ID,
  SNAPCHAT_CLIENT_ID: process.env.SNAPCHAT_CLIENT_ID,
  SOCIAL_REDIRECT_URL: process.env.SOCIAL_REDIRECT_URL,
  PASSWORD_PATTERN: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\w~@#$%^&*+=`|{}:;!.?\"()\[\]-]{8,}$/,
  NUMBER_PATTERN: /^[0-9]*$/,
  NUMBER_DECIMAL_PATTERN: /^[0-9]+([.][0-9]+)?$/,
  AWARD_IMG_MAX_SIZE: 2048000,
};
