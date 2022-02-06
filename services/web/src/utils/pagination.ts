import { TablePaginationConfig } from 'antd';

const PAGE_SIZE = 4;

export function paginationProps(length: number): TablePaginationConfig | false {
  if (length > PAGE_SIZE) {
    return { pageSize: PAGE_SIZE };
  }

  return false;
}
