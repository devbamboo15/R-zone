/** Below lines we are requiring using specific loaders to turn off css modules from webpack */
import '!style-loader!css-loader!sass-loader!react-toastify/dist/ReactToastify.min.css';
import '!style-loader!css-loader!sass-loader!react-dates/lib/css/_datepicker.css';
import '!style-loader!css-loader!sass-loader!react-popper-tooltip/dist/styles.css';
import '!style-loader!css-loader!normalize.css';
import '!style-loader!css-loader!sass-loader!./index.scss';
/** ** */

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { store, persistor } from 'src/store';
import { Provider as ThemeProvider } from 'src/helpers/ThemeContext';
import themes from 'src/styles/theme';
import Screens from './screens';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider value={themes.light}>
          <Screens />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
