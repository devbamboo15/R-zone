import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { RouteComponentProps } from 'react-router-dom';

declare global {
  interface IComponentProps {
    classes?: any;
  }

  type IScreenProps = IComponentProps & RouteComponentProps;

  interface IReduxAction {
    type: string;
    payload: any;
  }

  type CustomDispatch = ThunkDispatch<{}, {}, AnyAction>;

  type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

  type IReduxOperationRequest = {
    loading: boolean;
    error: string;
    status: 'success' | 'error' | '';
    data?: any;
  };
}
