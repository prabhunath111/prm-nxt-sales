import { useState } from 'react';
import { SortingState } from '@tanstack/react-table';

export function useSorting() {
  const [sorting, onSortingChange] = useState<SortingState>([]);

  return {
    sorting,
    onSortingChange,
  };
}
