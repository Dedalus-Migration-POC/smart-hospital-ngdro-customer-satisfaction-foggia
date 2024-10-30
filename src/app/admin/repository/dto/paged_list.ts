export type PagedList<T> = {
  "content": Array<T>;
  "pageable": Pageable,
  "totalPages": number;
  "totalElements": number;
  "last": boolean;
  "numberOfElements": number;
  "size": number;
  "number": number;
  "sort": Array<Sort>;
  "first": boolean;
  "empty": boolean;
}

export type Pageable = {
  "pageNumber": number;
  "pageSize": number;
  "sort": Array<Sort>;
  "offset": number;
  "paged": boolean;
  "unpaged": boolean;
}

type Sort = {
  "direction": 'ASC' | 'DESC';
  "property": string;
  "ignoreCase": boolean;
  "nullHandling": string;
  "descending": boolean;
  "ascending": boolean;
}
