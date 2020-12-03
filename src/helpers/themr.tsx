import * as React from 'react';
import omit from 'lodash/omit';
import { mapProps, compose } from 'recompose';
import { themr as BaseThemr } from '@friendsofreactjs/react-css-themr';
import { Consumer as ThemeConsumer } from 'src/helpers/ThemeContext';

const themr = <TProps extends any>(identifier: string, defaultStyles: any) => (
  WrappedComponent: React.ComponentType<TProps>
): React.ComponentType<TProps> => {
  class WrapperComponent extends React.Component<TProps> {
    render() {
      return (
        <ThemeConsumer>
          {theme => <WrappedComponent {...this.props} theme={theme} />}
        </ThemeConsumer>
      );
    }
  }

  return compose<TProps, TProps>(
    // BaseThemr accept `theme`, so we are first converting `classes` => `theme` using `mapProps`
    mapProps((ownProps: TProps) => ({
      ...ownProps,
      theme: ownProps.classes,
    })),
    BaseThemr(identifier, defaultStyles, {
      mapThemrProps: (props, finalTheme) => ({
        ...omit(props || {}, ['theme']),
        // Our component will expect `classes` prop, so we are first converting `finalTheme` => `classes`
        classes: finalTheme,
      }),
    })
  )(WrapperComponent);
};

export default themr;
