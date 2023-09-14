import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  maxVisiblePages?: number;
  ellipsisSymbol?: React.ReactNode;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
  ellipsisSymbol = '...',
}) => {
  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  const renderPageLinks = () => {
    const pageLinks = [];
    const halfMaxVisible = Math.floor(maxVisiblePages / 2);
    const firstPage = 1;
    const lastPage = totalPages;

    let startPage = Math.max(firstPage, currentPage - halfMaxVisible);
    let endPage = Math.min(lastPage, startPage + maxVisiblePages - 1);

    if (currentPage <= halfMaxVisible) {
      endPage = maxVisiblePages;
    } else if (currentPage >= lastPage - halfMaxVisible) {
      startPage = lastPage - maxVisiblePages + 1;
    }

    if (currentPage > firstPage) {
      pageLinks.push(
        <li key="prev" className="join-item btn" onClick={() => handlePageClick(currentPage - 1)}>
          <button className="page-link" >
            Previous
          </button>
        </li>
      );
    }

    if (startPage > firstPage) {
      pageLinks.push(
        <li key="first" className="join-item btn">
          <button className="page-link" onClick={() => handlePageClick(firstPage)}>
            {firstPage}
          </button>
        </li>
      );
      if (startPage > firstPage + 1) {
        pageLinks.push(
          <li key="ellipsis-start" className="join-item btn">
            <span className="page-link">{ellipsisSymbol}</span>
          </li>
        );
      }
    }

    for (let page = startPage; page <= endPage; page++) {
      pageLinks.push(
        <li
          key={page}
          className={`join-item btn ${page === currentPage ? 'bg-base-300' : ''}`}
          onClick={() => handlePageClick(page)}
        >
          <button className="page-link" >
            {page}
          </button>
        </li>
      );
    }

    if (endPage < lastPage) {
      if (endPage < lastPage - 1) {
        pageLinks.push(
          <li key="ellipsis-end" className="join-item btn">
            <span className="page-link">{ellipsisSymbol}</span>
          </li>
        );
      }
      pageLinks.push(
        <li key="last" className="join-item btn" onClick={() => handlePageClick(lastPage)}>
          <button className="page-link" >
            {lastPage}
          </button>
        </li>
      );
    }

    if (currentPage < lastPage) {
      pageLinks.push(
        <li key="next" className="join-item btn" onClick={() => handlePageClick(currentPage + 1)}>
          <button className="page-link" >
            Next
          </button>
        </li>
      );
    }

    return pageLinks;
  };

  return (
    <nav className='flex flex-row'>
      <ul className="join flex pt-4">
        {renderPageLinks()}
      </ul>
    </nav>
  );
};

export default Pagination;
