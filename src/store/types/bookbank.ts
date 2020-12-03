import createTypes from 'redux-create-action-types';

export default createTypes(
  'GET_USER_BOOKS_REQUEST',
  'GET_USER_BOOKS_SUCCESS',
  'GET_USER_BOOKS_ERROR',

  'SEARCH_BOOKS_REQUEST',
  'SEARCH_BOOKS_SUCCESS',
  'SEARCH_BOOKS_ERROR',
  'SEARCH_BOOKS_RESET',

  'ADD_BOOK_REQUEST',
  'ADD_BOOK_SUCCESS',
  'ADD_BOOK_ERROR',

  'REMOVE_BOOK_REQUEST',
  'REMOVE_BOOK_SUCCESS',
  'REMOVE_BOOK_ERROR',

  'FINISH_BOOK_REQUEST',
  'FINISH_BOOK_SUCCESS',
  'FINISH_BOOK_ERROR',

  'ADD_BOOKS_REQUEST',
  'ADD_BOOKS_SUCCESS',
  'ADD_BOOKS_ERROR',

  'FINISH_BOOKS_REQUEST',
  'FINISH_BOOKS_SUCCESS',
  'FINISH_BOOKS_ERROR'
);

export interface IBookItem {
  kind: string;
  id: string;
  etag: string;
  selfLink: string;
  read_count?: number;
  read_once?: boolean;
  group_id?: number | string;
  volumeInfo: {
    title: string;
    authors: string[];
    publisher: string;
    publishedDate: string;
    industryIdentifiers: {
      type: string;
      identifier: string;
    }[];
    readingModes: {
      text: boolean;
      image: boolean;
    };
    pageCount: number;
    printedPageCount: number;
    dimensions: {
      height: string;
      width: string;
      thickness: string;
    };
    printType: string;
    categories: string[];
    maturityRating: string;
    allowAnonLogging: boolean;
    contentVersion: string;
    imageLinks: {
      smallThumbnail: string;
      thumbnail: string;
    };
    language: string;
    previewLink: string;
    infoLink: string;
    canonicalVolumeLink: string;
  };
  saleInfo: {
    country: string;
    saleability: string;
    isEbook: boolean;
  };
  accessInfo: {
    country: string;
    viewability: string;
    embeddable: boolean;
    publicDomain: boolean;
    textToSpeechPermission: string;
    epub: {
      isAvailable: boolean;
    };
    pdf: {
      isAvailable: boolean;
    };
    webReaderLink: string;
    accessViewStatus: string;
    quoteSharingAllowed: boolean;
  };
}

export interface IUserBook {
  type: string;
  id: string;
  attributes: {
    data: IBookItem;
    mean_rating?: any;
    created_at: string;
    updated_at: string;
    name: string;
    completed_at?: string;
    read_count?: number;
    pivot: {
      user_id: number;
      book_id: string;
      created_at: string;
      updated_at: string;
      completed_at?: any;
    };
  };
  relationships: {
    reviews: {
      data: any[];
    };
  };
}

export interface IGoogleBook {
  kind: string;
  totalItems: number;
  items: IBookItem[];
}

export interface IBookOperationRequest {
  [key: string]: {
    loading: boolean;
    error: string | null;
    success: boolean;
  };
}
