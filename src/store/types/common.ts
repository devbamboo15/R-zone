import { IUserBook } from './bookbank';

export interface IUserData {
  id: string;
  attributes: {
    first_name: string;
    last_name: string;
    birthday: string;
    email: string;
    avatar: null | string;
    xp: number;
    notification_preferences: {
      opt_out: boolean;
      email_if_inactive: boolean;
    };
    created_at: string;
    updated_at: string;
    remember_token: string;
    name: null | string;
    reading_level: string;
    status: boolean;
    role: string;
    organization: any;
    subscription?: any;
  };
  relationships: {
    roles: {
      data: any[];
    };
    organization?: {
      data: {
        type: 'organization';
        id: string;
      };
    };
    trophies: {
      data: any[];
    };
  };
}

export interface IProgressObject {
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

export interface IReaderProgress {
  type: 'progress';
  id: string | number;
  attributes: {
    overallProgress: IProgressObject;
    intervalProgress: IProgressObject[];
  };
}

export interface IGoalProgressSummary {
  type: 'progressSummary';
  id: string | number;
  attributes: {
    overallProgress: IProgressObject;
    intervalProgress: IProgressObject[];
  };
}

export interface ILastEntryItem {
  type: 'last_entry';
  id: string;
  attributes: {
    user_id: number;
    goal_id: number;
    date: string;
    value: number;
    created_at: string;
    updated_at: string;
  };
}

export type IGroupReader = IUserData & {
  lastEntry: ILastEntryItem;
  progress: IReaderProgress;
};

export interface IGoalItemAttributes {
  name: string;
  group_id: number;
  metric_id: string;
  interval_id: string;
  value: number;
  start_date: string;
  end_date: string;
  deleted_at: string;
  created_at: string;
  updated_at: string;
  reading_log: number;
  program_id: number;
  total: number;
  group_name: string;
  program_name: string;
}

export interface IGoalItem {
  type: 'goal';
  id: string;
  attributes: IGoalItemAttributes;
  relationships?: {
    group: {
      data: {
        type: string;
        id: string;
      };
    };
    program: {
      data: {
        type: string;
        id: string;
      };
    };
  };
}

interface IProgress {
  type: 'progress';
  id: string;
  attributes: any;
}

export interface IOrganizerGroup {
  type: 'group';
  id: string;
  attributes: {
    name: string;
    program_id: number;
    created_at: string;
    updated_at: string;
    active_goal_id: number;
    total_readers: number;
  };
  goal: IGoalItem;
  books: IUserBook[];
  progress: IProgress;
}

export interface IReaderItem {
  type?: 'reader';
  user_id?: number;
  group?: any[];
  program?: any[];
  joined_date?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  status?: string;
  notes_count?: number;
  email?: string | null;
}

export interface Pagination {
  type: 'pagination';
  data: any[];
  current_page: number;
  from: number;
  last_page: number;
  next_page_url: string | null;
  per_page: number;
  prev_page_url: string | null;
  total: number;
}

export interface INoteData {
  id: string;
  user_id: string | number;
  note_text: string;
  created_at: string;
  created_by: string | number;
  created_by_user: any;
  note_for_user: any;
  updated_at: any;
}
