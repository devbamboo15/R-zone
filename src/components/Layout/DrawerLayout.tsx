import * as React from 'react';
import { Container, Grid } from 'semantic-ui-react';
import themr from 'src/helpers/themr';
import LeftBar from 'src/components/Leftbar';
import URL from 'src/helpers/urls';
import cx from 'classnames';
import styles from './styles.scss';

export type DrawerLayoutProps = IComponentProps & {
  children: React.ComponentType;
  path?: string;
};

const DrawerLayout = ({ children, classes, path }: DrawerLayoutProps) => {
  return (
    <Container fluid>
      <Grid stretched className={classes.grid}>
        <Grid.Column className={classes.leftBar}>
          <LeftBar />
        </Grid.Column>
        <Grid.Column
          width={16}
          className={cx(
            styles.mainContent,
            [URL.MANAGE_READERS()].includes(path)
              ? classes.mainContentOverflow
              : ''
          )}>
          {children}
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default themr<DrawerLayoutProps>('DrawerLayout', styles)(DrawerLayout);
