import * as React from 'react';
import cx from 'classnames';
import { Redirect } from 'react-router-dom';
import themr from 'src/helpers/themr';
import LoginHeader from 'src/components/LoginHeader';
import { Form, Container } from 'semantic-ui-react';
import urls from 'src/helpers/urls';
import * as queryString from 'query-string';
import get from 'lodash/get';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import MessageBox, { MessageBoxVariant } from 'src/components/MessageBox';
import styles from '../styles.scss';

export type OneLastThingProps = IScreenProps & {
  isLoggingIn?: boolean;
  isLoggedIn?: boolean;
  profileId?: string;
};

class OneLastThing extends React.Component<OneLastThingProps> {
  render() {
    const { classes, isLoggedIn, history, profileId } = this.props;

    const params = queryString.parse(history.location.search);
    const preSelectedPlanId = get(params, 'pre_selected_planid');
    const isFreePlan =
      preSelectedPlanId === 'school_pp_20' ||
      preSelectedPlanId === 'school_20' ||
      preSelectedPlanId === 'summer_pp_20' ||
      preSelectedPlanId === 'summer_20' ||
      preSelectedPlanId === 'year_pp_20' ||
      preSelectedPlanId === 'year_20';

    if (isFreePlan) {
      // if user selected free plan or user is directly came to signup page then dont show this page
      return <Redirect to={urls.PROGRAMS()} />;
    }

    if (isLoggedIn && profileId) {
      if (preSelectedPlanId)
        return (
          <Redirect
            to={`${urls.MYACCOUNT_TAB({
              tab: 'payments',
            })}?pre_selected_planid=${preSelectedPlanId}`}
          />
        );

      return <Redirect to={urls.PROGRAMS()} />;
    }

    return (
      <div className={classes.loginPage}>
        <LoginHeader history={history} />
        <div className={cx(classes.signupFlow, classes.loginPageBg)}>
          <Container fluid>
            <section>
              <div
                className={cx(classes.formPanel, classes.oneLastThingWrapper)}>
                <h2>One last thing ...</h2>
                <MessageBox
                  variant={MessageBoxVariant.INFO}
                  description={
                    <div>
                      Based on the number of readers you're expecting, you'll
                      need one of our payment plans to run a program of this
                      size. You can set this up right away by choosing{' '}
                      <b>"Pick a Plan"</b> below, or continue without this step
                      by selecting "Start my Free Trial" instead.
                      {/* Based on the number of readers you're expecting, you'll
                      need one of our payment plans to run a program of this
                      size.
                      <br />
                      <br />
                      You can set this up right away by choosing{' "'}
                      <b className={classes.purple}>Pick a Plan</b>
                      {'" '}
                      below, or continue without this step by selecting{' "'}
                      <b className={classes.green}>Start my Free Trial</b>
                      {'" '}
                      instead. */}
                      <br />
                      <br />
                      Remember, <b>Reader Zone is FREE up to 20 readers</b>, so
                      you'll automatically be using this tier until you upgrade
                      to a paid plan.
                      {/* Remember, <b>Reader Zone is FREE</b> up to 20 readers, so
                      you'll automatically be using this tier until you upgrade
                      to a paid plan. */}
                    </div>
                  }
                />
                <br />
                <div className={classes.center}>
                  <Form.Group
                    grouped
                    style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                    <Button
                      colorVariant={ButtonColor.SECONDARY}
                      buttonType={ButtonType.ROUND}
                      buttonProps={{
                        size: 'large',
                        type: 'button',
                        onClick: () => {
                          this.props.history.push(
                            `${urls.MYACCOUNT_TAB({
                              tab: 'payments',
                            })}?show_list_plan=true`
                          );
                        },
                      }}>
                      Pick a Plan
                    </Button>
                    <Button
                      colorVariant={ButtonColor.PRIMARY}
                      buttonType={ButtonType.ROUND}
                      buttonProps={{
                        size: 'large',
                        type: 'button',
                        onClick: () => {
                          this.props.history.push(urls.PROGRAMS());
                        },
                      }}>
                      Start my Free Trial
                    </Button>
                  </Form.Group>
                </div>
              </div>
            </section>
          </Container>
        </div>
      </div>
    );
  }
}

export default themr<OneLastThingProps>('OneLastThing', styles)(OneLastThing);
