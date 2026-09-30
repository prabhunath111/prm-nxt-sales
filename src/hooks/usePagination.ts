import { useMemo, useState } from 'react';
import { PaginationState } from '@tanstack/react-table';

export const usePagination = () => {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  return {
    limit: pageSize,
    setPagination,
    pagination,
    skip: pageSize * pageIndex,
  };
};
