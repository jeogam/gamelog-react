// src/interfaces/PageResponse.ts

export type SortInfo = {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
};

export type PageableInfo = {
  pageNumber: number;
  pageSize: number;
  sort: SortInfo;
  offset: number;
  paged: boolean;
};

export type PageResponse<T> = {
  content: T[];
  pageable: PageableInfo;

  totalPages: number;
  totalElements: number;

  last: boolean;
  first: boolean;

  size: number;
  number: number; 
  numberOfElements: number;
  empty: boolean;
};
