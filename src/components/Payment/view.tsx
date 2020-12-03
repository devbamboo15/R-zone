import * as React from 'react';
import cx from 'classnames';
import BraintreeWebDropIn from 'braintree-web-drop-in';
import * as Api from 'src/api';
import get from 'lodash/get';
import Spinner from 'src/components/Spinner';
import Button from 'src/components/Button';

export type Props = IComponentProps & {
  customClass?: any;
  onChange?: any;
  currentPaymentInfo?: any;
  loadedToken?: any;
  createSubscriptionWithBraintreeError?: any;
  createSubscriptionWithBraintreeLoading?: boolean;
};

class Payment extends React.Component<Props> {
  state = {
    loadedBraintreeToken: false,
    showErrorMessage: false,
  };

  braintreeWrapper;

  instance;

  async componentDidMount() {
    const { onChange, loadedToken } = this.props;
    const res = await Api.getBraintreeClientToken();
    const submitButton = document.querySelector('#submit-button');
    this.instance = (BraintreeWebDropIn as any).create(
      {
        container: this.braintreeWrapper,
        authorization: get(res, 'client_token', ''),
      },
      (err, dropinInstance) => {
        this.setState({
          loadedBraintreeToken: true,
        });
        submitButton.addEventListener('click', () => {
          dropinInstance.requestPaymentMethod((_, payload) => {
            onChange(payload);
          });
        });
        loadedToken();
        const classname = document.getElementsByClassName('braintree-method');

        const myFunction = function() {
          const currentClass = this.getAttribute('class') || '';
          if (!currentClass.includes('braintree-method--active')) {
            onChange(null);
          }
        };

        for (let i = 0; i < classname.length; i++) {
          classname[i].addEventListener('click', myFunction, false);
        }

        const chooseAnotherWay = document.getElementsByClassName(
          'braintree-toggle'
        );
        const enable = function() {
          onChange(null);
        };
        for (let i = 0; i < chooseAnotherWay.length; i++) {
          chooseAnotherWay[i].addEventListener('click', enable, false);
        }
      }
    );
  }

  componentDidUpdate(prevProps: Props) {
    const {
      createSubscriptionWithBraintreeLoading,
      createSubscriptionWithBraintreeError,
    } = this.props;
    if (
      !createSubscriptionWithBraintreeLoading &&
      createSubscriptionWithBraintreeLoading !==
        prevProps.createSubscriptionWithBraintreeLoading
    ) {
      this.setState({
        showErrorMessage: !!createSubscriptionWithBraintreeError,
      });
    }
  }

  render() {
    const {
      classes,
      customClass,
      currentPaymentInfo,
      createSubscriptionWithBraintreeLoading,
    } = this.props;
    const { loadedBraintreeToken, showErrorMessage } = this.state;
    return (
      <>
        {showErrorMessage && (
          <div className={classes.errorMessage}>
            Your card transaction failed. If you continue to have issues, please
            contact{' '}
            <a
              href="mailto:help@readerzone.com"
              title="mail to help@readerzone.com">
              help@readerzone.com
            </a>
          </div>
        )}
        <div className={cx(classes.wrapper, customClass)}>
          {!loadedBraintreeToken && <Spinner />}
          <div
            ref={ref => {
              this.braintreeWrapper = ref;
            }}
            className={classes.braintreeForm}
          />
          <Button
            buttonProps={{
              id: 'submit-button',
              type: 'button',
              loading: createSubscriptionWithBraintreeLoading,
              className: cx(
                classes.purchaseButton,
                !loadedBraintreeToken || currentPaymentInfo
                  ? classes.visibleHidden
                  : ''
              ),
            }}>
            Purchase
          </Button>
        </div>
      </>
    );
  }
}

export default Payment;
