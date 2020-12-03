import Types from 'src/store/types/plans';

const initialState = {
  plans: {
    data: [] as any[],
    error: null,
    loading: false,
  },
  createSubscription: {
    loading: false,
    success: false,
    error: '',
  },
  changeSubscription: {
    loading: false,
    success: false,
    error: '',
  },
  cancelSubscription: {
    loading: false,
    success: false,
    error: '',
  },
  updateCreditCardInfo: {
    loading: false,
    success: false,
    error: '',
  },
  createSubscriptionWithBraintree: {
    loading: false,
    data: {},
    error: null,
  },
  firstPayment: false,
};

export default (
  state = initialState,
  action: IReduxAction
): typeof initialState => {
  switch (action.type) {
    // Get braintree client token
    case Types.CREATE_SUBSCRIPTION_WITH_BRAINTREE_REQUEST: {
      return {
        ...state,
        createSubscriptionWithBraintree: {
          loading: true,
          data: {},
          error: null,
        },
      };
    }
    case Types.CREATE_SUBSCRIPTION_WITH_BRAINTREE_SUCCESS: {
      return {
        ...state,
        createSubscriptionWithBraintree: {
          loading: false,
          data: action.payload,
          error: null,
        },
      };
    }
    case Types.CREATE_SUBSCRIPTION_WITH_BRAINTREE_ERROR: {
      return {
        ...state,
        createSubscriptionWithBraintree: {
          data: {},
          loading: false,
          error: action.payload,
        },
      };
    }
    // Get all plans
    case Types.GET_PLANS: {
      return {
        ...state,
        plans: {
          ...state.plans,
          loading: true,
          error: null,
        },
      };
    }
    case Types.GET_PLANS_SUCCESS: {
      return {
        ...state,
        plans: {
          loading: false,
          data: action.payload,
          error: null,
        },
      };
    }
    case Types.GET_PLANS_ERROR: {
      return {
        ...state,
        plans: {
          ...state.plans,
          loading: false,
          error: action.payload,
        },
      };
    }
    // Create subscription
    case Types.CREATE_SUBSCRIPTION_REQUEST: {
      return {
        ...state,
        createSubscription: {
          loading: true,
          success: false,
          error: '',
        },
      };
    }
    case Types.CREATE_SUBSCRIPTION_SUCCESS: {
      return {
        ...state,
        createSubscription: {
          loading: false,
          success: true,
          error: '',
        },
      };
    }
    case Types.CREATE_SUBSCRIPTION_ERROR: {
      return {
        ...state,
        createSubscription: {
          loading: false,
          success: false,
          error: action.payload,
        },
      };
    }
    // Change subscription
    case Types.CHANGE_SUBSCRIPTION_REQUEST: {
      return {
        ...state,
        changeSubscription: {
          loading: true,
          success: false,
          error: '',
        },
      };
    }
    case Types.CHANGE_SUBSCRIPTION_SUCCESS: {
      return {
        ...state,
        changeSubscription: {
          loading: false,
          success: true,
          error: '',
        },
      };
    }
    case Types.CHANGE_SUBSCRIPTION_ERROR: {
      return {
        ...state,
        changeSubscription: {
          loading: false,
          success: false,
          error: action.payload,
        },
      };
    }
    // Cancel subscription
    case Types.CANCEL_SUBSCRIPTION_REQUEST: {
      return {
        ...state,
        cancelSubscription: {
          loading: true,
          success: false,
          error: '',
        },
      };
    }
    case Types.CANCEL_SUBSCRIPTION_SUCCESS: {
      return {
        ...state,
        cancelSubscription: {
          loading: false,
          success: true,
          error: '',
        },
      };
    }
    case Types.CANCEL_SUBSCRIPTION_ERROR: {
      return {
        ...state,
        cancelSubscription: {
          loading: false,
          success: false,
          error: action.payload,
        },
      };
    }
    // Update credit card information
    case Types.UPDATE_CREDIT_CARD_REQUEST: {
      return {
        ...state,
        updateCreditCardInfo: {
          loading: true,
          success: false,
          error: '',
        },
      };
    }
    case Types.UPDATE_CREDIT_CARD_SUCCESS: {
      return {
        ...state,
        updateCreditCardInfo: {
          loading: false,
          success: true,
          error: '',
        },
      };
    }
    case Types.UPDATE_CREDIT_CARD_ERROR: {
      return {
        ...state,
        updateCreditCardInfo: {
          loading: false,
          success: false,
          error: action.payload,
        },
      };
    }
    case Types.SET_FIRST_PAYMENT: {
      return {
        ...state,
        firstPayment: action.payload,
      };
    }
    default:
      return state;
  }
};
