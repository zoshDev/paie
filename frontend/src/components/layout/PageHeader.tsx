import React from 'react';
import type {ReactNode} from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({title, description, children}) => {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      {description && <p className="text-gray-600 mt-2">{description}</p>}
      {children && <div className="mt-4">{children}</div>}
    </header>
  );
};  

export default PageHeader;
// This PageHeader component is a reusable header for pages, displaying a title, optional description, and additional content.