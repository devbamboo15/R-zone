import * as React from 'react';
import themr from 'src/helpers/themr';
import Badge, { BadgeSize } from 'src/components/Badge';
import { Grid } from 'semantic-ui-react';
import styles from './styles.scss';

export type SnapchatProps = IComponentProps & {};

class Snapchat extends React.Component<SnapchatProps> {
  render() {
    const { classes } = this.props;

    return (
      <div>
        <div className={classes.coupons}>
          <Grid>
            <Grid.Column mobile={16} computer={5}>
              <Badge badgeSize={BadgeSize.X_LAGER} isSpecial />
            </Grid.Column>
          </Grid>
        </div>
      </div>
    );
  }
}

export default themr<SnapchatProps>('Snapchat', styles)(Snapchat);
