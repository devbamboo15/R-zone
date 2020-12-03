import * as React from 'react';
import Badge, { BadgeSize } from 'src/components/Badge';
import { Grid } from 'semantic-ui-react';
import get from 'lodash/get';

export type TwitterProps = IComponentProps & {
  programs?: any;
  share?: any;
  chooseProgram: Function;
};

class Twitter extends React.Component<TwitterProps> {
  // handleClick = program => {
  //   this.props.chooseProgram(program.id);
  // };

  render() {
    const { classes, programs, share } = this.props;

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
              <Grid.Column mobile={16} computer={8} key={program.id}>
                <Badge
                  badgeSize={BadgeSize.X_LAGER}
                  program={program}
                  share={share}
                />
              </Grid.Column>
            )}
            {/* 
            <Grid.Column
              mobile={16}
              computer={5}
              key={program.id}
              onClick={() => this.handleClick(program)}>
              <Badge
                badgeSize={BadgeSize.X_LAGER}
                program={program}
                share={share}
              />
            </Grid.Column>
            <Grid.Column mobile={16} computer={4}>
              <Badge badgeSize={BadgeSize.MEDIUM} isSpecial />
            </Grid.Column>
            <Grid.Column mobile={16} computer={7}>
              <Badge badgeSize={BadgeSize.SMALL} isSpecial />
            </Grid.Column> */}
          </Grid>
        </div>
      </div>
    );
  }
}

export default Twitter;
