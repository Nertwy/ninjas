import React from "react";


type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  maxVisiblePages?: number;
  ellipsisSymbol?: React.ReactNode;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
  ellipsisSymbol = "...",
}) => {
  return (
    <nav className="flex flex-row">
      <ul className="join flex pt-4">
        {renderPageLinks(
          currentPage,
          totalPages,
          onPageChange,
          maxVisiblePages,
          ellipsisSymbol as string,
        )}
      </ul>
    </nav>
  );
};

export default Pagination;

const renderPageLinks = (
  currentPage: number,
  totalPages: number,
  onPageChange: (newPage: number) => void,
  maxVisiblePages = 5,
  ellipsisSymbol = "...",
) => {
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
      <li
        key="prev"
        className="btn join-item"
        onClick={() => onPageChange(currentPage - 1)}
      >
        <button className="page-link">Previous</button>
      </li>,
    );
  }

  if (startPage > firstPage) {
    pageLinks.push(
      <li key="first" className="btn join-item">
        <button className="page-link" onClick={() => onPageChange(firstPage)}>
          {firstPage}
        </button>
      </li>,
    );
    if (startPage > firstPage + 1) {
      pageLinks.push(
        <li key="ellipsis-start" className="btn join-item">
          <span className="page-link">{ellipsisSymbol}</span>
        </li>,
      );
    }
  }

  for (let page = startPage; page <= endPage; page++) {
    pageLinks.push(
      <li
        key={page}
        className={`btn join-item ${page === currentPage ? "bg-base-300" : ""}`}
        onClick={() => onPageChange(page)}
      >
        <button className="page-link">{page}</button>
      </li>,
    );
  }

  if (endPage < lastPage) {
    if (endPage < lastPage - 1) {
      pageLinks.push(
        <li key="ellipsis-end" className="btn join-item">
          <span className="page-link">{ellipsisSymbol}</span>
        </li>,
      );
    }
    pageLinks.push(
      <li
        key="last"
        className="btn join-item"
        onClick={() => onPageChange(lastPage)}
      >
        <button className="page-link">{lastPage}</button>
      </li>,
    );
  }

  if (currentPage < lastPage) {
    pageLinks.push(
      <li
        key="next"
        className="btn join-item"
        onClick={() => onPageChange(currentPage + 1)}
      >
        <button className="page-link">Next</button>
      </li>,
    );
  }

  return pageLinks;
};
