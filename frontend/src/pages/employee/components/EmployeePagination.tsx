import React from 'react';

interface Props {
  page: number;
  setPage: (v: number) => void;
  totalPages: number;
}

const EmployeePagination: React.FC<Props> = ({ page, setPage, totalPages }) => (
  <div className="flex justify-end items-center gap-2 mt-2">
    <button
      onClick={() => setPage(page - 1 > 0 ? page - 1 : 1)}
      disabled={page === 1}
      className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
    >
      Précédent
    </button>
    <span className="text-sm text-gray-700 dark:text-gray-200">
      Page {page} / {totalPages}
    </span>
    <button
      onClick={() => setPage(page + 1 <= totalPages ? page + 1 : totalPages)}
      disabled={page === totalPages}
      className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
    >
      Suivant
    </button>
  </div>
);

export default EmployeePagination;