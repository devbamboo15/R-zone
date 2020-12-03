import * as React from 'react';
import { Grid, Segment } from 'semantic-ui-react';
import Title, { TitleProps } from 'src/components/Title';
import Checkbox from 'src/components/FormFields/Checkbox';
import cx from 'classnames';
import themr from 'src/helpers/themr';

import styles from './styles.scss';

export type TopHeaderProps = IComponentProps & {
  handleToggleDisplay: Function;
  titleProps: TitleProps;
  title: string;
  values: any;
};

const TopHeader = ({
  classes,
  handleToggleDisplay,
  titleProps,
  title,
  values,
}) => (
  <Grid>
    <Grid.Column width={6}>
      <Title {...titleProps}>{title}</Title>
    </Grid.Column>
    <Grid.Column
      width={8}
      className={classes.containerDisplays}
      floated="right">
      <div className={classes.displays}>
        <label className={classes.displayLabel}>Display:</label>
        <Segment.Group horizontal className={classes.displayModes}>
          <Segment
            className={cx(classes.displayItem, {
              [classes.displayItemActive]: values.activity,
            })}>
            <Checkbox
              checkboxProps={{
                radio: true,
                checked: values.activity,
                onClick: () =>
                  handleToggleDisplay('activity', !values.activity),
                label: 'Activity Feed',
              }}
            />
          </Segment>
          <Segment
            className={cx(classes.displayItem, {
              [classes.displayItemActive]: values.overview,
            })}>
            <Checkbox
              checkboxProps={{
                radio: true,
                checked: values.overview,
                onClick: () =>
                  handleToggleDisplay('overview', !values.overview),
                label: 'Overview',
              }}
            />
          </Segment>
          <Segment
            className={cx(classes.displayItem, {
              [classes.displayItemActive]: values.totals,
            })}>
            <Checkbox
              checkboxProps={{
                radio: true,
                checked: values.totals,
                onClick: () => handleToggleDisplay('totals', !values.totals),
                label: 'Totals',
              }}
            />
          </Segment>
        </Segment.Group>
      </div>
    </Grid.Column>
  </Grid>
);

export default themr<TopHeaderProps>('TopHeader', styles)(TopHeader);
