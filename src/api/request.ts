import BaseAxios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import get from 'lodash/get';
import { store, persistor } from 'src/store';
import { IReduxState } from 'src/store/reducers';
import idx from 'idx';
import toast from 'src/helpers/Toast';
import urls from 'src/helpers/urls';

const SESSION_EXPIRED =
  'The resource owner or authorization server denied the request.';

class Request {
  public axios: AxiosInstance;

  constructor() {
    this.axios = BaseAxios.create({
      baseURL: process.env.API_BASE_URL,
    });
  }

  public async call(config: AxiosRequestConfig) {
    try {
      const state: IReduxState = store.getState();
      const token = idx(state, x => x.auth.login.access_token);
      let headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: token,
      };

      if (token) {
        headers = {
          ...headers,
          Authorization: `Bearer ${token}`,
        };
      }

      const res = await this.axios.request({ headers, ...config });
      return res.data;
    } catch (error) {
      if (error.response) {
        const data = get(error, 'response.data') || {};
        const errorCode = get(error, 'response.status', '');
        if (data.access && errorCode === 403) {
          let oldProductionUrl = urls.OLD_PRODUCT_APP;
          if (data.wp && data.sid) {
            oldProductionUrl = `${urls.OLD_PRODUCT_APP}?ref=wp&sid=${data.sid}`;
          } else {
            await persistor.purge();
          }
          window.location.href = oldProductionUrl;
          throw data;
        } else {
          const message: string = get(data, 'message');
          if (message === SESSION_EXPIRED) {
            // if we got this error message means, session is expired, we can logout the user
            toast.error('Session Expired');
            store.dispatch({ type: 'LOGOUT' });
            throw { message };
          }

          if (message) {
            toast.error(message);
            throw { message };
          }

          if (data instanceof Object) {
            let errorStr = ``;
            for (const key in data) {
              if (data.hasOwnProperty(key)) {
                errorStr += data[key].join(',');
              }
            }
            errorStr = errorStr || 'Something is wrong';
            if (config.url !== '/auth/register/') {
              toast.error(errorStr);
            }
            throw { message: errorStr };
          }
          throw data;
        }
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        throw error.request;
      } else {
        // Something happened in setting up the request that triggered an Error
        throw { message: error.message };
      }
    }
  }
}

export default new Request();
