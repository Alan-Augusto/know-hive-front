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
