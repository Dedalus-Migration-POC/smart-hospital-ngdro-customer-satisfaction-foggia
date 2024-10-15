export type PagedList<T> = {
  "content": Array<T>;
  "pageable": {
    "pageNumber": number;
    "pageSize": number;
    "sort": any[];
    "offset": number;
    "paged": boolean;
    "unpaged": boolean;
  },
  "totalPages": number;
  "totalElements": number;
  "last": boolean;
  "numberOfElements": number;
  "size": number;
  "number": number;
  "sort": any[];
  "first": boolean;
  "empty": boolean;
}
