import * as React from 'react';

import urls from 'src/helpers/urls';
import history from 'src/helpers/history';
import WelcomeModal from 'src/components/Modal/WelcomeModal';
import { detectMobile } from 'src/helpers/methods';

export type ConfirmationProps = IScreenProps & {
  doLogout?: Function;
};

const Confirmation = (props: ConfirmationProps) => {
  const { doLogout } = props;
  return (
    <WelcomeModal
      modelProps={{
        open: true,
        centered: false,
        dimmer: 'inverted',
      }}
      action="Create new Program"
      onClose={() => {
        if (detectMobile()) {
          localStorage.setItem('notRedirect', 'true');
          doLogout();
          window.location.href = urls.SITE_HOMEPAGE;
        } else {
          history.push(urls.PROGRAMS());
        }
      }}
    />
  );
};

export default Confirmation;
