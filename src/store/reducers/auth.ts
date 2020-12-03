import merge from 'lodash/merge';
import Types from '../types/auth';
import { IUserData } from '../types/common';

interface ICheckResetPasswordData {
  isReset?: boolean;
}

const initialState = {
  login: {
    inProgress: false,
    error: '',
    token_type: '',
    expires_in: 0,
    access_token: '',
    refresh_token: '',
    isSandboxLogin: false,
  },
  register: {
    inProgress: false,
    error: '',
    status: '',
    data: {},
    numberOfReaders: '',
  },
  registerSkeepOrg: {
    inProgress: false,
    error: '',
    status: '',
    numberOfReader: '',
    data: {},
    preSelectedPlanId: '',
  },
  profile: {
    inProgress: false,
    error: '',
    data: {} as IUserData,
  },
  reset_password: {
    inProgress: false,
    error: '',
    success: null,
  },
  check_reset_password: {
    inProgress: false,
    error: '',
    data: {} as ICheckResetPasswordData,
  },
  user_social: {
    inProgress: false,
    error: '',
    data: {},
  },
  forget_password: {
    inProgress: false,
    error: '',
    success: null,
  },
  sandbox_login: {
    inProgress: false,
    error: '',
    success: null,
  },
  signupToken: {
    loading: false,
    error: '',
    data: {},
  },
  signupEmail: {
    loading: false,
    error: '',
    existing: false,
  },
  meBetaOff: {
    loading: false,
    error: '',
  },
};

export default (
  state = initialState,
  action: IReduxAction
): typeof initialState => {
  switch (action.type) {
    case 'persist/PURGE': {
      return {
        ...initialState,
        profile: {
          inProgress: false,
          error: '',
          data: {} as IUserData,
        },
      };
    }
    case Types.LOGOUT: {
      return {
        ...initialState,
        profile: {
          inProgress: false,
          error: '',
          data: {} as IUserData,
        },
      };
    }
    case Types.LOGIN_REQUEST: {
      return {
        ...state,
        login: {
          ...state.login,
          inProgress: true,
        },
        profile: {
          inProgress: false,
          error: '',
          data: {} as IUserData,
        },
      };
    }
    case Types.LOGIN_SUCCESS: {
      return {
        ...state,
        login: {
          ...state.login,
          inProgress: false,
          error: '',
          ...action.payload,
        },
      };
    }
    case Types.LOGIN_ERROR: {
      return {
        ...state,
        login: {
          ...state.login,
          inProgress: false,
          error: action.payload,
        },
      };
    }
    // REGISTER
    case Types.REGISTER_RESET: {
      return {
        ...state,
        register: {
          inProgress: false,
          status: '',
          error: '',
          numberOfReaders: '',
          data: {},
        },
      };
    }
    case Types.REGISTER_REQUEST: {
      return {
        ...state,
        register: {
          ...state.register,
          inProgress: true,
          status: '',
          numberOfReaders: '',
          data: {},
        },
      };
    }
    case Types.REGISTER_SUCCESS: {
      return {
        ...state,
        register: {
          ...state.register,
          inProgress: false,
          error: '',
          status: 'success',
          ...action.payload,
        },
      };
    }
    case Types.REGISTER_ERROR: {
      return {
        ...state,
        register: {
          ...state.register,
          inProgress: false,
          status: 'failure',
          error: action.payload,
          numberOfReaders: '',
          data: {},
        },
      };
    }
    // UPDATE ACCOUNT
    case Types.UPDATE_ACCOUNT_REQUEST: {
      return {
        ...state,
        profile: {
          ...state.profile,
          inProgress: true,
        },
      };
    }
    case Types.UPDATE_ACCOUNT_SUCCESS: {
      return {
        ...state,
        profile: merge(state.profile, {
          inProgress: false,
          error: '',
          data: action.payload.data,
        }),
      };
    }
    case Types.UPDATE_ACCOUNT_ERROR: {
      return {
        ...state,
        profile: {
          ...state.profile,
          inProgress: false,
          error: action.payload,
        },
      };
    }

    // CHECK SIGNUP TOKEN
    case Types.CHECK_SIGNUP_TOKEN_REQUEST: {
      return {
        ...state,
        signupToken: {
          loading: true,
          data: {},
          error: '',
        },
      };
    }
    case Types.CHECK_SIGNUP_TOKEN_SUCCESS: {
      return {
        ...state,
        signupToken: {
          loading: false,
          data: action.payload,
          error: '',
        },
      };
    }
    case Types.CHECK_SIGNUP_TOKEN_ERROR: {
      return {
        ...state,
        signupToken: {
          loading: false,
          data: {},
          error: action.payload,
        },
      };
    }

    case Types.RESET_PASSWORD_REQUEST: {
      return {
        ...state,
        reset_password: {
          ...state.reset_password,
          inProgress: true,
          error: '',
        },
      };
    }

    case Types.RESET_PASSWORD_SUCCESS: {
      return {
        ...state,
        reset_password: {
          ...state.reset_password,
          inProgress: false,
          error: '',
          success: true,
        },
      };
    }

    case Types.RESET_PASSWORD_ERROR: {
      return {
        ...state,
        reset_password: {
          ...state.reset_password,
          inProgress: false,
          error: action.payload,
        },
      };
    }

    case Types.CHECK_RESET_PASSWORD_REQUEST: {
      return {
        ...state,
        check_reset_password: {
          data: {},
          inProgress: true,
          error: '',
        },
      };
    }

    case Types.CHECK_RESET_PASSWORD_SUCCESS: {
      return {
        ...state,
        check_reset_password: {
          data: action.payload,
          inProgress: false,
          error: '',
        },
      };
    }

    case Types.CHECK_RESET_PASSWORD_ERROR: {
      return {
        ...state,
        check_reset_password: {
          data: {},
          inProgress: false,
          error: action.payload,
        },
      };
    }

    case Types.USER_SOCIAL_REQUEST: {
      return {
        ...state,
        user_social: {
          ...state.user_social,
          inProgress: true,
        },
      };
    }

    case Types.USER_SOCIAL_SUCCESS: {
      return {
        ...state,
        user_social: {
          ...state.user_social,
          inProgress: false,
          data: action.payload,
        },
      };
    }

    case Types.USER_SOCIAL_ERROR: {
      return {
        ...state,
        user_social: {
          ...state.user_social,
          inProgress: false,
          error: action.payload,
        },
      };
    }

    case Types.FORGET_PASSWORD_REQUEST: {
      return {
        ...state,
        forget_password: {
          ...state.forget_password,
          inProgress: true,
        },
      };
    }

    case Types.FORGET_PASSWORD_SUCCESS: {
      return {
        ...state,
        forget_password: {
          ...state.forget_password,
          inProgress: false,
          success: true,
        },
      };
    }

    case Types.FORGET_PASSWORD_ERROR: {
      return {
        ...state,
        forget_password: {
          ...state.forget_password,
          inProgress: false,
          success: '',
          error: action.payload,
        },
      };
    }

    case Types.RESET_SANDBOX_LOGIN_INFO: {
      return {
        ...state,
        sandbox_login: {
          ...initialState.sandbox_login,
        },
      };
    }
    case Types.SANDBOX_LOGIN_REQUEST: {
      return {
        ...state,
        sandbox_login: {
          ...state.sandbox_login,
          inProgress: true,
        },
      };
    }
    case Types.SANDBOX_LOGIN_SUCCESS: {
      return {
        ...state,
        sandbox_login: {
          ...state.sandbox_login,
          inProgress: false,
          success: true,
          error: null,
        },
        login: {
          ...state.login,
          ...action.payload,
          isSandboxLogin: true,
        },
      };
    }
    case Types.SANDBOX_LOGIN_FAILURE: {
      return {
        ...state,
        sandbox_login: {
          ...state.sandbox_login,
          inProgress: false,
          success: false,
          error: action.payload,
        },
      };
    }
    // Check exiting Email
    case Types.CHECK_EXISTING_EMAIL_REQUEST: {
      return {
        ...state,
        signupEmail: {
          ...state.signupEmail,
          loading: true,
          error: '',
          existing: false,
        },
      };
    }
    case Types.CHECK_EXISTING_EMAIL_SUCCESS: {
      return {
        ...state,
        signupEmail: {
          ...state.signupEmail,
          loading: false,
          error: '',
          existing: action.payload,
        },
      };
    }
    case Types.CHECK_EXISTING_EMAIL_ERROR: {
      return {
        ...state,
        signupEmail: {
          ...state.signupEmail,
          loading: false,
          error: action.payload,
          existing: false,
        },
      };
    }

    // REGISTER
    case Types.REGISTER_SKEEP_ORG_RESET: {
      return {
        ...state,
        registerSkeepOrg: {
          inProgress: false,
          status: '',
          error: '',
          numberOfReader: '',
          preSelectedPlanId: '',
          data: {},
        },
      };
    }
    case Types.REGISTER_SKEEP_ORG_REQUEST: {
      return {
        ...state,
        registerSkeepOrg: {
          ...state.registerSkeepOrg,
          inProgress: true,
          status: '',
          numberOfReader: '',
          preSelectedPlanId: '',
          data: {},
        },
      };
    }
    case Types.REGISTER_SKEEP_ORG_SUCCESS: {
      return {
        ...state,
        registerSkeepOrg: {
          ...state.registerSkeepOrg,
          inProgress: false,
          error: '',
          status: 'success',
          ...action.payload,
        },
      };
    }
    case Types.REGISTER_SKEEP_ORG_ERROR: {
      return {
        ...state,
        registerSkeepOrg: {
          ...state.registerSkeepOrg,
          inProgress: false,
          status: 'failure',
          error: action.payload,
          numberOfReader: '',
          preSelectedPlanId: '',
          data: {},
        },
      };
    }
    case Types.ME_BETA_OFF_REQUEST: {
      return {
        ...state,
        meBetaOff: {
          loading: true,
          error: '',
        },
      };
    }
    case Types.ME_BETA_OFF_SUCCESS: {
      return {
        ...state,
        meBetaOff: {
          loading: false,
          error: '',
        },
      };
    }
    case Types.ME_BETA_OFF_ERROR: {
      return {
        ...state,
        meBetaOff: {
          loading: false,
          error: action.payload,
        },
      };
    }

    default:
      return state;
  }
};
