import * as React from 'react';
import themr from 'src/helpers/themr';
import styles from './styles.scss';

export type BaseLabelProps = IComponentProps & {};

class Label extends React.Component<BaseLabelProps, {}> {
  render() {
    const { classes, children } = this.props;
    return <label className={classes.labelStyle}>{children}</label>;
  }
}

export default themr<BaseLabelProps>('Label', styles)(Label);
