import * as React from 'react';
import themr from 'src/helpers/themr';
import Spinner from 'src/components/Spinner';
import styles from '../../styles.scss';

const Loading = props => {
  const { classes } = props;
  return (
    <div className={classes.loading}>
      <Spinner />
    </div>
  );
};

export default themr('Loading', styles)(Loading);
