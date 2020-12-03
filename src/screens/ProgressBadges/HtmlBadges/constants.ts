const METRIC_OPTIONS = [
  {
    label: 'Pages',
    value: 'pages',
  },
  {
    label: 'Books',
    value: 'books',
  },
  {
    label: 'Chapters',
    value: 'chapters',
  },
  {
    label: 'Minutes',
    value: 'minutes',
  },
  {
    label: 'Yes/No',
    value: 'yes/no',
  },
];

const BADGE_TYPE_OPTIONS = [
  { text: 'Progress Badges', value: '2' },
  { text: 'Leaderboard', value: '1' },
  { text: 'All', value: '3' },
];

export const GOAL_BASE_PROGRAM = 0;
export const READING_LOG_PROGRAM = 1;
export const GROUP_VS_GROUP_PROGRAM = 2;
export const READER_VS_READER_PROGRAM = 3;

export { METRIC_OPTIONS, BADGE_TYPE_OPTIONS };
