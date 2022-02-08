import { TablePaginationConfig } from 'antd';

const PAGE_SIZE = 4;

export function paginationProps(
  length: number,
  pageSize: number = PAGE_SIZE
): TablePaginationConfig | false {
  if (length > pageSize) {
    return { pageSize: pageSize || PAGE_SIZE };
  }

  return false;
}
