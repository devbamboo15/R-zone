import * as React from 'react';
import themr from 'src/helpers/themr';
import { Grid } from 'semantic-ui-react';
import ProressBar, { ProgressColorVariant } from 'src/components/ProressBar';

import styles from '../styles.scss';

export type ProgressPercentageProps = IComponentProps & {
  completionProgress: any;
};

const ProgressPercentage = ({ classes, completionProgress }) => {
  return (
    <>
      <Grid.Column width="1">
        <div className={classes.perText}>0%</div>
      </Grid.Column>
      <Grid.Column width="12">
        <ProressBar
          progressProps={{
            value: completionProgress < 0 ? 0 : completionProgress,
            progress: 'value',
            size: 'tiny',
          }}
          colorVariant={
            completionProgress <= 25
              ? ProgressColorVariant.RED
              : completionProgress <= 50
              ? ProgressColorVariant.YELLOW
              : ProgressColorVariant.GREEN
          }
        />
      </Grid.Column>
      <Grid.Column width="1">
        <div className={classes.perText}>
          {completionProgress > 100 ? completionProgress : '100'}%
        </div>
      </Grid.Column>
    </>
  );
};

export default themr<ProgressPercentageProps>('ProgressPercentage', styles)(
  ProgressPercentage
);
