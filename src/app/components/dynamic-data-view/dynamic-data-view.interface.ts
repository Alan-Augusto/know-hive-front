export interface ColumnDefinition<T = any> {
  field: keyof T & string; // Garante que o field exista no objeto T
  header: string;
  width?: string;
  dataType?: 'date' | 'currency' | 'weight' | 'percent';
  formatOptions?: {
    currencyCode?: string; // Ex: 'BRL'
    dateFormat?: string;   // Ex: 'dd/MM/yyyy', 'shortDate'
    locale?: string;       // Ex: 'pt-BR'
  };
}

export interface ActionDefinition<T = any> {
  label: string;
  icon?: string;
  tooltip?: string;
  type?: 'primary' | 'secondary' | 'tertiary' | 'accent' | 'danger' | 'danger-light';
  visible?: (row: T) => boolean;
  disabled?: (row: T) => boolean;
  onClick: (row: T) => void;
}
