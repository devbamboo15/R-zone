import * as React from 'react';
import themr from 'src/helpers/themr';
import get from 'lodash/get';
import cx from 'classnames';
import { formatNumber } from 'src/helpers/number';
import styles from '../styles.scss';

export type ProgressDetailProps = IComponentProps & {
  readingLogProgress: any;
  detailPage?: boolean;
};

const ProgressDetail = ({ classes, readingLogProgress, detailPage }) => {
  const readingLogProgressBooks = get(readingLogProgress, 'books');
  const readingLogProgressChapters = get(readingLogProgress, 'chapters');
  const readingLogProgressPages = get(readingLogProgress, 'pages');
  const readingLogProgressMinutes = get(readingLogProgress, 'minutes');
  const readingLogProgressYes = get(readingLogProgress, 'yes/no');
  return (
    <div
      className={cx(
        classes.readingLogProgress,
        !detailPage ? '' : classes.readerDetailSection
      )}>
      {readingLogProgressBooks >= 0 ? (
        <span>
          <b>{formatNumber(readingLogProgressBooks)}</b>
          {!detailPage ? ' ' : ' Total '}
          {readingLogProgressBooks >= 2 ? 'Books' : 'Book'}
          {!detailPage ? '' : ' Completed'}
        </span>
      ) : (
        ''
      )}
      {readingLogProgressChapters >= 0 ? (
        <span>
          {readingLogProgressBooks ? ' / ' : ''}
          <b>{formatNumber(readingLogProgressChapters)}</b>
          {!detailPage ? ' ' : ' Total '}
          {readingLogProgressChapters >= 2 ? 'Chapters' : 'Chapter'}
          {!detailPage ? '' : ' Completed'}
        </span>
      ) : (
        ''
      )}
      {readingLogProgressMinutes >= 0 ? (
        <span>
          {readingLogProgressBooks || readingLogProgressChapters ? ' / ' : ''}
          <b>{formatNumber(readingLogProgressMinutes)}</b>
          {!detailPage ? ' ' : ' Total '}
          {readingLogProgressMinutes >= 2 ? 'Minutes' : 'Minute'}
          {!detailPage ? '' : ' Completed'}
        </span>
      ) : (
        ''
      )}
      {readingLogProgressPages >= 0 ? (
        <span>
          {readingLogProgressBooks ||
          readingLogProgressChapters ||
          readingLogProgressMinutes
            ? ' / '
            : ''}
          <b>{formatNumber(readingLogProgressPages)}</b>
          {!detailPage ? ' ' : ' Total '}
          {readingLogProgressPages >= 2 ? 'Pages Read' : 'Page Read'}
          {!detailPage ? '' : ' Completed'}
        </span>
      ) : (
        ''
      )}
      {readingLogProgressYes >= 0 ? (
        <span>
          {readingLogProgressBooks ||
          readingLogProgressChapters ||
          readingLogProgressMinutes ||
          readingLogProgressPages
            ? ' / '
            : ''}
          <b>{formatNumber(readingLogProgressYes)}</b>
          {!detailPage ? ' ' : ' Total '}
          {readingLogProgressYes >= 2 ? '"Yes" Entries' : '"Yes" Entry'}
          {!detailPage ? '' : ' Completed'}
        </span>
      ) : (
        ''
      )}
    </div>
  );
};

export default themr<ProgressDetailProps>('ProgressDetail', styles)(
  ProgressDetail
);
