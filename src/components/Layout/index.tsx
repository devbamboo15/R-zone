import * as React from 'react';
import { Route, RouteProps } from 'react-router-dom';
import EmptyLayout from './EmptyLayout';
import DrawerLayout from './DrawerLayout';

export type LayoutProps = {
  render?: (props: any) => React.ReactElement;
  component?: any;
  layout?: any;
} & RouteProps;

const LayoutRoute = ({
  render,
  component: Component,
  layout: Layout = EmptyLayout,
  ...rest
}: LayoutProps) => {
  return (
    <Route
      {...rest}
      render={
        render
          ? props => <Layout path={rest.path}>{render(props)}</Layout>
          : props => (
              <Layout path={rest.path}>
                <Component {...props} />
              </Layout>
            )
      }
    />
  );
};

export default LayoutRoute;
export { DrawerLayout, EmptyLayout };
