import * as Api from 'src/api';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import Types from '../types/setup';

export const getMeChild = () => async (dispatch: CustomDispatch) => {
  try {
    dispatch({ type: Types.GET_ME_CHILD_REQUEST });
    const res = await Api.meChild();
    dispatch({ type: Types.GET_ME_CHILD_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({ type: Types.GET_ME_CHILD_ERROR, payload: error });
  }
};
export const addMeChildData = (data: any) => async (
  dispatch: CustomDispatch
) => {
  dispatch({ type: Types.ADD_ME_CHILD_DATA, payload: data });
};

export const addMeChild = (data: any, cb?: any) => async (
  dispatch: CustomDispatch
) => {
  try {
    dispatch({ type: Types.ADD_ME_CHILD_REQUEST });
    const res = await Api.addMeChild(data);
    dispatch({ type: Types.ADD_ME_CHILD_SUCCESS, payload: res });
    if (cb) cb(get(res, 'data') || {});
  } catch (error) {
    dispatch({ type: Types.ADD_ME_CHILD_ERROR, payload: error });
  }
};

const convertToArray = obj => {
  if (isArray(obj)) {
    return obj;
  }
  const arr = [];
  Object.keys(obj).map(k => {
    arr.push(obj[k]);
    return true;
  });
  return arr;
};
export const getMeProgram = (params?: Api.IMeProgramParams) => async (
  dispatch: CustomDispatch
) => {
  try {
    dispatch({ type: Types.GET_ME_PROGRAM_REQUEST });
    const res = await Api.meProgram(params || {});
    const data = res.programs
      ? res.programs.map(p => {
          const newP = { ...p };
          newP.id = p.id.toString();
          newP.groups = p.groups
            ? convertToArray(p.groups).map(g => {
                return {
                  ...g,
                  id: g.id.toString(),
                };
              })
            : [];
          return newP;
        })
      : [];
    dispatch({ type: Types.GET_ME_PROGRAM_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: Types.GET_ME_PROGRAM_ERROR, payload: error });
  }
};

export const updateMeProgram = (data: any[]) => async (
  dispatch: CustomDispatch
) => {
  dispatch({ type: Types.GET_ME_PROGRAM_SUCCESS, payload: data });
};

export const getMeChildDetails = (readerId: string) => async (
  dispatch: CustomDispatch
) => {
  try {
    dispatch({ type: Types.GET_ME_CHILD_DETAILS_REQUEST });
    const res = await Api.meChildDetails(readerId);
    const data = {
      programs: res.programs
        ? res.programs.map(p => {
            const newP = { ...p };
            newP.id = p.id.toString();
            newP.groups = p.groups
              ? convertToArray(p.groups).map(g => {
                  return {
                    ...g,
                    id: g.id.toString(),
                  };
                })
              : [];
            return newP;
          })
        : [],
    };
    dispatch({ type: Types.GET_ME_CHILD_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: Types.GET_ME_CHILD_DETAILS_ERROR, payload: error });
  }
};
export const updateMeChildDetails = (data: any) => async (
  dispatch: CustomDispatch
) => {
  dispatch({ type: Types.GET_ME_CHILD_DETAILS_SUCCESS, payload: data });
};
export const setLastEntryData = (data: any) => async (
  dispatch: CustomDispatch
) => {
  dispatch({ type: Types.SET_LAST_ENTRY_DATA, payload: data });
};
