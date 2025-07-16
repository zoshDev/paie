export interface MenuAction<T = any> {
  label: string;
  icon?: React.ReactNode;
  onClick?: (item: T) => void;
}
