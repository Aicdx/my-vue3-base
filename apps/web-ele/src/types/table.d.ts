interface TableApi {
  PageFetchParams: {
    page: number;
    pageSize: number;
  };
  PageFetchResult: {
    content: any[];
    totalElements: number;
  };
}

export type { TableApi };
