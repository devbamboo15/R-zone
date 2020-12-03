import * as React from 'react';
import { Grid, Icon } from 'semantic-ui-react';
import Heading, { HeadingType } from 'src/components/Heading';
import DescriptionBlock from 'src/components/DescriptionBlock';
import themr from 'src/helpers/themr';
import StopWatch from 'src/assets/icons/stopwatch.svg';
import DoubleArrowUp from 'src/assets/icons/double_arrow_up.svg';
import BookPlus from 'src/assets/icons/book_plus.svg';
import styles from './styles.scss';

type Props = IComponentProps & {
  onSelectFlow: (value: InitialStepFlow) => any;
};

export enum InitialStepFlow {
  ADVANCED,
  QUICK_START,
}

class InitialStep extends React.Component<Props> {
  render() {
    const { classes, onSelectFlow } = this.props;
    return (
      <div className={classes.initialFlow}>
        <div className={classes.headerTitle}>
          <BookPlus height={80} className={classes.headerIcon} />
          <Heading headingProps={{ as: 'h2' }} type={HeadingType.BOLD_500}>
            Create a Program
          </Heading>
        </div>
        <Grid doubling columns="2">
          <Grid.Row>
            <Grid.Column>
              <DescriptionBlock
                icon={<DoubleArrowUp height={60} />}
                iconActive={<DoubleArrowUp height={60} />}
                title="Advanced"
                description="Ideal for organizations that require more than ten Reading Groups. Quickly set up and duplicate Programs and Groups with similar attributes."
                onClick={() => {
                  onSelectFlow(InitialStepFlow.ADVANCED);
                }}
              />
            </Grid.Column>
            <Grid.Column>
              <DescriptionBlock
                icon={<StopWatch height={60} />}
                iconActive={<StopWatch height={60} />}
                title="Quick Start"
                description="Ideal for organizations with fewer than ten Reading Groups. The setup wizard walks you through the process of creating your first Reading Program and Reading Group."
                onClick={() => {
                  onSelectFlow(InitialStepFlow.QUICK_START);
                }}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <div className={classes.note}>
          *Any account can host an unlimited number of reading programs, groups
          and participants. The advanced set up allow a streamlined way to
          create a large number of reading programs and reading groups.
        </div>
        <div className={classes.videoTutorialLinkWrapper}>
          <div className={classes.videoIconWrapper}>
            <Icon name="video camera" className={classes.videoIcon} />
          </div>
          <a href="#">View Video Tutorial</a>
        </div>
      </div>
    );
  }
}

export default themr<Props>('InitialStep', styles)(InitialStep);
