import themr from 'src/helpers/themr';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { IReduxState } from 'src/store/reducers';
import get from 'lodash/get';
import idx from 'idx';
import {
  getReaderFeeds,
  updateReaderFeed,
  deleteReaderFeed,
} from 'src/store/actions/organizer/reader';

import ReaderFeeds, { Props } from './view';
import styles from '../styles.scss';

export default compose<Props, Props>(
  themr<Props>('ReaderFeeds', styles),
  connect(
    (state: IReduxState) => {
      const readerFeeds = idx(state, x => x.organizer.reader.feeds.data) || [];
      const readerFeedsLoading = idx(
        state,
        x => x.organizer.reader.feeds.loading
      );
      const updateFeedLoading = idx(
        state,
        x => x.organizer.reader.updateFeed.loading
      );
      const deleteFeedLoading = idx(
        state,
        x => x.organizer.reader.deleteFeed.loading
      );
      const profileId = idx(state, x => x.auth.profile.data.id);
      const organizationId = idx(
        state,
        x => x.auth.profile.data.relationships.organization.data.id
      );
      const access = idx(state, x => x.organizer.users.usersAccess.data);
      const userAccessProgram = get(
        access,
        `access.${profileId}[0].attributes.access.${organizationId}`,
        {}
      );

      return {
        readerFeeds,
        readerFeedsLoading,
        updateFeedLoading,
        deleteFeedLoading,
        userAccessProgram,
        programs: idx(state, x => x.organizer.program.programs.data) || [],
        readerData: idx(state, x => x.organizer.reader.reader.data) || {},
      };
    },
    {
      getReaderFeeds,
      updateReaderFeed,
      deleteReaderFeed,
    }
  )
)(ReaderFeeds);
