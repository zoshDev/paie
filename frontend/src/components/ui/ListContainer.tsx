import React from 'react';

interface ListContainerProps {
  children: React.ReactNode;
}

const ListContainer: React.FC<ListContainerProps> = ({ children }) => {
  return (
    <div className="flex flex-col gap-4">
      {children}
      <hr className="border-t border-gray-300 dark:border-gray-700 my-2" />
    </div>
  );
};

export default ListContainer;