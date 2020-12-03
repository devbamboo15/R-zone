import { connect } from 'react-redux';
import themr from 'src/helpers/themr';
import { compose } from 'recompose';
import { IReduxState } from 'src/store/reducers';
import idx from 'idx';
import {
  getAllOrganizations,
  setOrganization,
} from 'src/store/actions/organizer/organizations';
import MyOrganizations, { MyOrganizationsProps } from './MyOrganizations';
import styles from './styles.scss';

export default compose(
  themr<MyOrganizationsProps>('AuthorizedUsers', styles),
  connect(
    (state: IReduxState) => {
      const organizationsLoading = idx(
        state,
        x => x.organizer.organizations.organizations.loading
      );
      const organizationId = idx(
        state,
        x => x.auth.profile.data.relationships.organization.data.id
      );
      return {
        organizationsLoading,
        organizationId,
        organizations:
          idx(state, x => x.organizer.organizations.organizations.data) || [],
      };
    },
    {
      getAllOrganizations,
      setOrganization,
    }
  )
)(MyOrganizations);
