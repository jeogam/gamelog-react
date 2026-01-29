// src/services/pageable.ts

export type PageableQuery = {
  page?: number; 
  size?: number; 
  sort?: string; 
};

export function pageableParams(q?: PageableQuery) {
  return {
    page: q?.page ?? 0,
    size: q?.size ?? 10,
    sort: q?.sort, 
  };
}
