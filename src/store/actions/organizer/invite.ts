import * as API from 'src/api';
import toast from 'src/helpers/Toast';
import Types from '../../types/organizer/invite';

export const sendInviteReaders = (
  data: API.ICreateInviteReadersData,
  cb?: Function
) => async (dispatch: CustomDispatch) => {
  try {
    dispatch({ type: Types.SEND_INVITE_READERS });
    const res = await API.sendInviteReaders(data);
    dispatch({ type: Types.SEND_INVITE_READERS_SUCCESS, payload: res });
    if (cb) cb();

    let count = 0;
    for (const email in res) {
      if (res[email] === 1) count++;
    }
    dispatch(
      getInviteReaders(
        {
          user_id: data.user_id,
          page: 1,
          programs: null,
          groups: null,
          roles: null,
        },
        count
      )
    );
  } catch (error) {
    dispatch({ type: Types.SEND_INVITE_READERS_ERROR, payload: error });
  }
};

export const getInviteReaders = (
  data: API.IGetInviteReaders,
  limit = 0
) => async (dispatch: CustomDispatch) => {
  try {
    dispatch({ type: Types.GET_INVITE_READERS });
    const res = await API.getInviteReaders(data);

    let result = res.data;

    if (limit > 0) {
      result = result.filter((item, index) => item && index < limit);
    }

    dispatch({ type: Types.GET_INVITE_READERS_SUCCESS, payload: result });
  } catch (error) {
    dispatch({ type: Types.GET_INVITE_READERS_ERROR, payload: error });
  }
};

export const previewInviteReader = (
  data: API.IPreviewInviteReaderData
) => async (dispatch: CustomDispatch) => {
  try {
    dispatch({ type: Types.PREVIEW_INVITE_READER_REQUEST });
    const res = await API.previewInviteReader(data);
    dispatch({ type: Types.PREVIEW_INVITE_READER_SUCCESS, payload: res });
    toast.success('Send email successfully!');
  } catch (error) {
    dispatch({ type: Types.PREVIEW_INVITE_READER_ERROR, payload: error });
  }
};
