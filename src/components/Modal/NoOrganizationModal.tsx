import * as React from 'react';
import Modal, { BaseModalProps } from 'src/components/Modal';
import themr from 'src/helpers/themr';
import history from 'src/helpers/history';
import URL from 'src/helpers/urls';
import { Link } from 'react-router-dom';
import styles from './styles.scss';

export type NoOrganizationModalProps = IComponentProps &
  BaseModalProps & {
    children?: any;
    action?: string;
  };

const NoOrganizationModal = ({
  modelProps,
  classes,
  children,
  action,
}: NoOrganizationModalProps) => (
  <Modal
    modelProps={{
      ...modelProps,
      className: classes.noOrgStyle,
      closeIcon: true,
      onClose: () => {
        history.push(URL.MYACCOUNT_TAB({ tab: 'organization' }));
      },
    }}
    contentProps={{ className: classes.noOrgContentStyle }}>
    {children || (
      <div className={classes.defaultChild}>
        <div>
          Almost done! To {action || 'Create new Program'},<br /> you'll need to
          fill in your <br />{' '}
          <Link to={URL.MYACCOUNT_TAB({ tab: 'organization' })}>
            <b>Organization details</b>
          </Link>{' '}
          first.
        </div>
      </div>
    )}
  </Modal>
);

export default themr<NoOrganizationModalProps>('NoOrganizationModal', styles)(
  NoOrganizationModal
);
