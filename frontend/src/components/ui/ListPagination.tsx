import React from 'react';

interface ListPaginationProps {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}

const ListPagination: React.FC<ListPaginationProps> = ({
  page,
  setPage,
  totalPages,
}) => {
  return (
    <div className="flex justify-end items-center gap-2 mt-4">
      <button
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
      >
        Précédent
      </button>
      <span>
        Page {page} / {totalPages}
      </span>
      <button
        onClick={() => setPage(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
      >
        Suivant
      </button>
    </div>
  );
};

export default ListPagination;