import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import LeadershipFriendsvg from 'assets/icons/badgeLeadershipFriend.svg';
import logoReaderZone from 'src/assets/images/logo_reader_zone.png';
import { capitalize } from 'src/helpers/methods';

export type ProgresBadgeDesignProps = IComponentProps & {
  userLeaderboard?: any;
  programName?: string;
};

class ProgresBadgeDesign extends React.Component<ProgresBadgeDesignProps> {
  render() {
    const { classes, userLeaderboard, programName } = this.props;

    return (
      <div>
        <div className={classes.coupons}>
          <Grid>
            <Grid.Column mobile={16} computer={8}>
              <div className={classes.badgesShareInner}>
                <div className={classes.badgeShareList}>
                  <div className={classes.logo}>
                    <img
                      src={logoReaderZone}
                      className={classes.logoReaderZone}
                      alt="Reader Zone"
                    />
                  </div>
                  <div className={classes.heading}>
                    {/* <h5>Chesterville Elementary</h5> */}
                    <h5>{programName || 'Placeholder Program'}</h5>
                  </div>
                  <ul>
                    {userLeaderboard.length === 0 && (
                      <li style={{ height: '58px' }} />
                    )}
                    {userLeaderboard.map((leaderboard, i) => {
                      return (
                        <li key={i}>
                          <div className={classes.icon}>
                            <LeadershipFriendsvg />
                          </div>
                          <div className={classes.content}>
                            <span className={classes.des}>
                              {leaderboard.group_name}
                            </span>
                            <span className={classes.total}>
                              {leaderboard.total_score}{' '}
                              {capitalize(leaderboard.metric_id)}
                            </span>
                          </div>
                          <div className={classes.number}>{i + 1}</div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </Grid.Column>
          </Grid>
        </div>
      </div>
    );
  }
}

export default ProgresBadgeDesign;
