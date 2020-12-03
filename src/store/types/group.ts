import createTypes from 'redux-create-action-types';

export default createTypes(
  'SELECT_CURRENT_GROUP',
  'GET_GROUPS_REQUEST',
  'GET_GROUPS_SUCCESS',
  'GET_GROUPS_ERROR',

  'CREATE_READING_ENTRY_REQUEST',
  'CREATE_READING_ENTRY_SUCCESS',
  'CREATE_READING_ENTRY_ERROR',

  'BULK_ENTRY_REQUEST',
  'BULK_ENTRY_SUCCESS',
  'BULK_ENTRY_ERROR'
);

export interface IGroupItem {
  id: string;
  type: 'PAGES' | 'CHAPTERS' | 'MINUTES' | 'BOOKS' | 'YESNO';
  name: string;
}

export enum Metric {
  'chapters' = 'chapters',
  'yes/no' = 'yes/no',
  'pages' = 'pages',
  'books' = 'books',
  'minutes' = 'minutes',
}

export enum MetricText {
  'chapters' = 'Chapters',
  'yes/no' = 'Yes/no',
  'pages' = 'Pages',
  'books' = 'Books',
  'minutes' = 'Minutes',
}

export enum Interval {
  'program' = 'program',
  'daily' = 'daily',
  'week' = 'week',
  'month' = 'month',
}

export interface IGoalInfo {
  name: string;
  group_id: string | number;
  metric_id: Metric;
  interval_id: Interval | null;
  value: number;
  start_date: string;
  end_date: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  reading_log: 0 | 1;
  total: number;
  group_name: string;
  program_name: string;
}

export interface IGoalEntryInfo {
  user_id: string | number;
  goal_id: string | number;
  date: string;
  value: number;
  created_at: string;
  updated_at: string;
}

export interface IGoalProgressInfo {
  user_id: string | number;
  goal_id: string | number;
  start_date: string;
  end_date: string;
  target_interval_value: number;
  target_overall_value: number;
  on_track_percentage: number;
  on_track_value: number;
  completed_interval_percentage: number;
  completed_interval_value: number;
  completed_overall_percentage: number;
  completed_overall_value: number;
  remaining_overall_value: number;
  remaining_overall_percentage: number;
  remaining_per_day_value: number;
  remaining_overall_progress_message: string;
}

export interface IGoalProgressSummary {
  type: 'progressSummary';
  id: string | number;
  attributes: {
    overallProgress: IGoalProgressInfo;
    intervalProgress: IGoalProgressInfo[];
  };
}

export interface IGoalEntry {
  type: 'entry';
  id: string | number;
  attributes: IGoalEntryInfo;
}

export interface IGoal {
  type: 'goal';
  id: string | number;
  attributes: IGoalInfo;
  entries: IGoalEntry[];
  progressSummary: IGoalProgressSummary;
}
