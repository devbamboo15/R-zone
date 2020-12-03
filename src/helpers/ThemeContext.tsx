import * as React from 'react';
import theme from 'src/styles/theme';

const themeContext = React.createContext(theme.light);

const { Provider, Consumer } = themeContext;

export { Provider, Consumer };
