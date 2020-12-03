import * as React from 'react';
import themr from 'src/helpers/themr';
import Badge, { BadgeSize } from 'src/components/Badge';
import { Grid } from 'semantic-ui-react';
import styles from './styles.scss';

export type InstagramProps = IComponentProps & {};

class Instagram extends React.Component<InstagramProps> {
  render() {
    const { classes } = this.props;

    return (
      <div>
        <div className={classes.coupons}>
          <Grid>
            <Grid.Column mobile={16} computer={4}>
              <Badge badgeSize={BadgeSize.LARGE} isSpecial />
            </Grid.Column>
            <Grid.Column mobile={16} computer={4}>
              <Badge badgeSize={BadgeSize.X_LAGER} isSpecial />
            </Grid.Column>
            <Grid.Column mobile={16} computer={4}>
              <Badge badgeSize={BadgeSize.MEDIUM} isSpecial />
            </Grid.Column>
            <Grid.Column mobile={16} computer={4}>
              <Badge badgeSize={BadgeSize.SMALL} isSpecial />
            </Grid.Column>
          </Grid>
        </div>
      </div>
    );
  }
}

export default themr<InstagramProps>('Instagram', styles)(Instagram);
