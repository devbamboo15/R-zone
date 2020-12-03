import * as React from 'react';
import cx from 'classnames';
import themr from 'src/helpers/themr';
import hatImg from 'assets/images/zone-type/organizer.png';
import groupImg from 'assets/images/zone-type/parent.png';
import bookImg from 'assets/images/zone-type/reader.png';
import hatImgActive from 'assets/images/zone-type/organizer-active.png';
import groupImgActive from 'assets/images/zone-type/parent-active.png';
import bookImgActive from 'assets/images/zone-type/reader-active.png';
import { Grid, Image, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import urls from 'src/helpers/urls';
import * as queryString from 'query-string';
import get from 'lodash/get';
import * as H from 'history';
import styles from '../styles.scss';

type Props = IComponentProps & {
  jumpToNextStep?: Function;
  onNext?: Function;
  history: H.History;
};

export enum Role {
  READER = 'reader',
  PARENT = 'parent',
  ORGANIZER = 'organizer',
}

class ZoneType extends React.Component<Props> {
  onNextPress = role => {
    this.props.jumpToNextStep();
    if (this.props.onNext) {
      this.props.onNext(role);
    }
  };

  render() {
    const { classes, history } = this.props;

    const params = queryString.parse(history.location.search);
    const preSelectedPlanId = get(params, 'pre_selected_planid');

    return (
      <div className={classes.options}>
        <Grid centered>
          <Grid.Column mobile={16} computer={5}>
            <div
              onClick={() => this.onNextPress(Role.READER)}
              className={cx(classes.inner, classes.reader)}>
              <div className={classes.img}>
                <Image src={bookImg} />
              </div>
              <div className={classes.imgActive}>
                <Image src={bookImgActive} />
              </div>
              <div>
                <h3>Reader</h3>
                <p>
                  For Users who will sign up to participate in reading program
                  themselves.
                </p>
              </div>
              <p className={classes.checkRow}>
                <span className={classes.checkIcon}>
                  <Icon name="check" />
                </span>
              </p>
            </div>
          </Grid.Column>
          <Grid.Column mobile={16} computer={5}>
            <div
              onClick={() => this.onNextPress(Role.PARENT)}
              className={cx(classes.inner, classes.parent)}>
              <div className={classes.img}>
                <Image src={groupImg} />
              </div>
              <div className={classes.imgActive}>
                <Image src={groupImgActive} />
              </div>
              <div>
                <h3>Parent</h3>
                <p>
                  For users who are enrolling multiple readers in reading
                  programs, including themselves.
                </p>
              </div>
              <p className={classes.checkRow}>
                <span className={classes.checkIcon}>
                  <Icon name="check" />
                </span>
              </p>
            </div>
          </Grid.Column>
          <Grid.Column mobile={16} computer={5}>
            <div
              onClick={() => this.onNextPress(Role.ORGANIZER)}
              className={cx(classes.inner, classes.organizer)}>
              <div className={classes.img}>
                <Image src={hatImg} />
              </div>
              <div className={classes.imgActive}>
                <Image src={hatImgActive} />
              </div>
              <div>
                <h3>Organizer</h3>
                <p>
                  For users who will build and manage a reading program for an
                  organization like a school, library family, etc.
                </p>
              </div>
              <p className={classes.checkRow}>
                <span className={classes.checkIcon}>
                  <Icon name="check" />
                </span>
              </p>
            </div>
          </Grid.Column>
        </Grid>
        <Grid>
          <Grid.Column>
            <div className={classes.foot}>
              {preSelectedPlanId ? (
                <Link
                  to={`${urls.LOGIN()}?pre_selected_planid=${preSelectedPlanId}`}>
                  I already have an account
                </Link>
              ) : (
                <Link to={urls.LOGIN()}>I already have an account</Link>
              )}
            </div>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default themr<Props>('ZoneType', styles)(ZoneType);
