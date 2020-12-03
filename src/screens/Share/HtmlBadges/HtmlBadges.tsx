import * as React from 'react';
import Badge, { BadgeSize, BadgeType } from 'src/components/Badge';
import { Grid } from 'semantic-ui-react';
import get from 'lodash/get';

export type HtmlBadgesProps = IComponentProps & {
  programs?: any;
  share?: any;
  auth?: any;
};

class HtmlBadges extends React.Component<HtmlBadgesProps> {
  render() {
    const { classes, programs, share, auth } = this.props;
    let program = null;
    const userShare = get(share, 'data[0]attributes');
    if (!userShare) {
      program = get(programs, '[0]');
    } else {
      program = programs.find(item => item.id * 1 === userShare.program_id);
      if (!program) {
        program = get(programs, '[0]');
      }
    }

    return (
      <div>
        <div className={classes.coupons}>
          <Grid>
            {program && (
              <>
                <Grid.Column mobile={16} computer={4} key={program.id}>
                  <Badge
                    badgeSize={BadgeSize.LARGE}
                    badgeType={BadgeType.HTML}
                    isSpecial
                    program={program}
                    share={share}
                    auth={auth}
                  />
                </Grid.Column>
                <Grid.Column mobile={16} computer={6}>
                  <Badge
                    badgeSize={BadgeSize.SMALL}
                    badgeType={BadgeType.HTML}
                    isSpecial
                    program={program}
                    share={share}
                    auth={auth}
                  />
                </Grid.Column>
                <Grid.Column mobile={16} computer={5}>
                  <Badge
                    badgeSize={BadgeSize.MEDIUM}
                    badgeType={BadgeType.HTML}
                    isSpecial
                    program={program}
                    share={share}
                    auth={auth}
                  />
                </Grid.Column>
              </>
            )}
          </Grid>
        </div>
      </div>
    );
  }
}

export default HtmlBadges;
