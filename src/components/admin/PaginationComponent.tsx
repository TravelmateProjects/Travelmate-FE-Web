import React from 'react';
import { Pagination } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationComponent: React.FC<Props> = ({ currentPage, totalPages, onPageChange }) => {
  const { t } = useTranslation();

  const pageItems = [];

  const renderPageItem = (page: number) => (
    <Pagination.Item
      key={page}
      active={page === currentPage}
      onClick={() => onPageChange(page)}
    >
      {page}
    </Pagination.Item>
  );

  const pageRange = 1; // số trang hiển thị ở hai bên trang hiện tại

  if (totalPages <= 7) {
    // ít trang thì hiển thị hết
    for (let number = 1; number <= totalPages; number++) {
      pageItems.push(renderPageItem(number));
    }
  } else {
    // luôn hiển thị trang đầu
    pageItems.push(renderPageItem(1));

    if (currentPage > pageRange + 2) {
      pageItems.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
    }

    const start = Math.max(2, currentPage - pageRange);
    const end = Math.min(totalPages - 1, currentPage + pageRange);

    for (let number = start; number <= end; number++) {
      pageItems.push(renderPageItem(number));
    }

    if (currentPage < totalPages - pageRange - 1) {
      pageItems.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
    }

    // luôn hiển thị trang cuối
    pageItems.push(renderPageItem(totalPages));
  }

  return (
    <Pagination className="justify-content-center mt-4">
      <Pagination.Prev
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        {t('previous')}
      </Pagination.Prev>

      {pageItems}

      <Pagination.Next
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {t('next')}
      </Pagination.Next>
    </Pagination>
  );
};

export default PaginationComponent;
