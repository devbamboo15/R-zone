import createTypes from 'redux-create-action-types';
import { IBookItem } from './bookbank';
import { IGoalItemAttributes } from './common';

export default createTypes(
  // GOAL SEARCH
  'GOALSEARCH_BOOK_REQUEST',
  'GOALSEARCH_BOOK_SUCCESS',
  'GOALSEARCH_BOOK_ERROR',
  'GOALSEARCH_BOOK_RESET',

  // GOAL JOIN
  'GOALJOIN_BOOK_REQUEST',
  'GOALJOIN_BOOK_SUCCESS',
  'GOALJOIN_BOOK_ERROR',

  // GOAL LEAVE
  'GOALLEAVE_BOOK_REQUEST',
  'GOALLEAVE_BOOK_SUCCESS',
  'GOALLEAVE_BOOK_ERROR',

  // Goal Progress
  'PROGRESS_REQUEST',
  'PROGRESS_SUCCESS',
  'PROGRESS_ERROR'
);

export interface IAwardTimelineEvent {
  name: string;
  group_name: string;
}

export interface IReadingEntryTimelineEvent {
  date: string;
  group_name: string;
  value: number;
  metric_id: string;
}

export interface IBookFinishedTimelineEvent {
  name: string;
  group_name: string;
  data: IBookItem;
  completed_at: string;
}

export type IGoalMetTimelineEvent = IGoalItemAttributes;

export interface IProgramTimelineEvent {
  name: string;
  start_date: string;
  end_date: string;
  program_joined?: string;
  program_ended?: string;
  deleted_at: string;
}

export interface ITimelineItem {
  type: 'entry' | 'award' | 'book' | 'goal' | 'program';
  id: string | number;
  attributes:
    | IAwardTimelineEvent
    | IReadingEntryTimelineEvent
    | IBookFinishedTimelineEvent
    | IGoalMetTimelineEvent
    | IProgramTimelineEvent;
}

export interface IProgressItem {
  group_name: string;
  pages: number;
  chapters: number;
  minutes: number;
  books: number;
  timeline: ITimelineItem[];
}
