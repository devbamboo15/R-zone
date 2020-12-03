import * as React from 'react';
import cx from 'classnames';
import { Progress, ProgressProps } from 'semantic-ui-react';

export type Props = IComponentProps & {
  progressProps?: ProgressProps;
  colorVariant?: ProgressColorVariant;
};

export enum ProgressColorVariant {
  RED = 'RED',
  YELLOW = 'YELLOW',
  GREEN = 'GREEN',
}

class ProgressBar extends React.Component<Props> {
  render() {
    const { progressProps, classes, colorVariant } = this.props;
    return (
      <Progress
        {...progressProps}
        className={cx(classes.progress, {
          [classes.progressRed]: colorVariant === ProgressColorVariant.RED,
          [classes.progressGreen]: colorVariant === ProgressColorVariant.GREEN,
          [classes.progressYellow]:
            colorVariant === ProgressColorVariant.YELLOW,
        })}
      />
    );
  }
}

export default ProgressBar;
