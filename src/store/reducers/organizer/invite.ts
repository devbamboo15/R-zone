import Types, { IInviteReaderItem } from 'src/store/types/organizer/invite';

const initialState = {
  invites: {
    loading: false,
    isInviteSaved: false,
    error: null as string,
    data: {} as object,
  },
  invited: {
    loading: false,
    error: null as string,
    data: [] as IInviteReaderItem[],
  },
  preview: {
    loading: false,
    error: null as string,
  },
};

export default (
  state = initialState,
  action: IReduxAction
): typeof initialState => {
  switch (action.type) {
    // Send Invite readers
    case Types.SEND_INVITE_READERS: {
      return {
        ...state,
        invites: {
          ...state.invites,
          loading: true,
          isInviteSaved: false,
        },
      };
    }

    case Types.SEND_INVITE_READERS_SUCCESS: {
      return {
        ...state,
        invites: {
          ...state.invites,
          loading: false,
          isInviteSaved: true,
          error: '',
          data: action.payload || {},
        },
      };
    }

    case Types.SEND_INVITE_READERS_ERROR: {
      return {
        ...state,
        invites: {
          ...state.invites,
          loading: false,
          isInviteSaved: false,
          error: action.payload,
        },
      };
    }

    // Get Invite readers
    case Types.GET_INVITE_READERS: {
      return {
        ...state,
        invited: {
          ...state.invited,
          loading: true,
        },
      };
    }

    case Types.GET_INVITE_READERS_SUCCESS: {
      return {
        ...state,
        invited: {
          ...state.invited,
          loading: false,
          error: '',
          data: action.payload,
        },
      };
    }

    case Types.GET_INVITE_READERS_ERROR: {
      return {
        ...state,
        invited: {
          ...state.invited,
          loading: false,
          error: action.payload,
        },
      };
    }
    // Preview email
    case Types.PREVIEW_INVITE_READER_REQUEST: {
      return {
        ...state,
        preview: {
          loading: true,
          error: '',
        },
      };
    }

    case Types.PREVIEW_INVITE_READER_SUCCESS: {
      return {
        ...state,
        preview: {
          loading: false,
          error: '',
        },
      };
    }

    case Types.PREVIEW_INVITE_READER_ERROR: {
      return {
        ...state,
        preview: {
          loading: false,
          error: action.payload,
        },
      };
    }
    default:
      return state;
  }
};
