interface TableApi {
  PageFetchParams: {
    current?: number;
    page?: number;
    pageSize?: number;
    pid?: number;
    size?: number;
  };
  PageFetchResult: {
    content: any[];
    totalElements: number;
  };
}

export type { TableApi };
