import React from 'react';

interface PaginationProps {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  setPage,
  totalPages,
  size = 'md',
  className = ''
}) => {
  // Calculer la plage de pages à afficher
  let displayedPages = [];
  const range = 2; // Nombre de pages à afficher de chaque côté de la page actuelle

  if (totalPages <= 5) {
    // Afficher toutes les pages si moins de 5
    displayedPages = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    // Calculer la plage
    const start = Math.max(1, page - range);
    const end = Math.min(totalPages, page + range);

    // Ajouter la première page, la dernière page et la plage calculée
    if (start > 1) {
      displayedPages.push(1);
      if (start > 2) displayedPages.push(null); // Ellipsis
    }

    for (let i = start; i <= end; i++) {
      displayedPages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) displayedPages.push(null); // Ellipsis
      displayedPages.push(totalPages);
    }
  }

  // Classes selon la taille
  const btnClass = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1',
    lg: 'px-4 py-2 text-lg'
  }[size];

  return (
    <div className={`flex justify-center items-center space-x-1 ${className}`}>
      <button
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className={`${btnClass} bg-white dark:bg-gray-800 border rounded text-gray-600 dark:text-gray-300 disabled:opacity-50`}
      >
        &laquo;
      </button>
      
      {displayedPages.map((pageNum, idx) => 
        pageNum === null ? (
          <span key={`ellipsis-${idx}`} className="px-2">...</span>
        ) : (
          <button
            key={`page-${pageNum}`}
            onClick={() => setPage(pageNum as number)}
            className={`${btnClass} ${
              pageNum === page
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 border text-gray-600 dark:text-gray-300'
            } rounded`}
          >
            {pageNum}
          </button>
        )
      )}
      
      <button
        onClick={() => setPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className={`${btnClass} bg-white dark:bg-gray-800 border rounded text-gray-600 dark:text-gray-300 disabled:opacity-50`}
      >
        &raquo;
      </button>
    </div>
  );
};

export default Pagination; 