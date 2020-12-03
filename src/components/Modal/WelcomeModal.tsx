import * as React from 'react';
import Modal, { BaseModalProps } from 'src/components/Modal';
import themr from 'src/helpers/themr';
import Button, { ButtonColor, ButtonType } from 'src/components/Button';
import Heading, { HeadingType, HeadingColor } from 'src/components/Heading';
import newProduct from 'src/assets/images/new-product.png';
import styles from './styles.scss';

export type WelcomeModalProps = IComponentProps &
  BaseModalProps & {
    children?: any;
    action?: string;
    onClose?: any;
  };

const WelcomeModal = ({
  modelProps,
  classes,
  children,
  onClose,
}: WelcomeModalProps) => (
  <Modal
    modelProps={{
      ...modelProps,
      dimmer: 'blurring',
      className: classes.welcomeStyle,
      onClose,
    }}
    contentProps={{ className: classes.welcomeContentStyle }}>
    {children || (
      <div className={classes.defaultChild}>
        <div className={classes.childInner}>
          <img
            src={newProduct}
            className={classes.newProductImg}
            alt="new-product"
          />
          <h2 className={classes.welcomeHeading}>
            Your Reader Zone account is now active!
          </h2>
          <p className={classes.welcomeDes}>
            You can now begin creating amazing Reading Programs. Please visit
            the your Admin Portal on a desktop to continue your program setup.
            <br />
            Please <a href="mailto:help@readerzone.com">contact us</a> anytime
            you need help.
          </p>
          <Button
            colorVariant={ButtonColor.PRIMARY}
            buttonType={ButtonType.ROUND}
            buttonProps={{
              onClick: onClose,
            }}>
            <Heading
              headingProps={{ as: 'h5' }}
              colorVariant={HeadingColor.WHITE}
              type={HeadingType.BOLD_600}>
              Get Started!
            </Heading>
          </Button>
        </div>
      </div>
    )}
  </Modal>
);

export default themr<WelcomeModalProps>('WelcomeModal', styles)(WelcomeModal);
