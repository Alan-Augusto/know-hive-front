import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe, CurrencyPipe, PercentPipe } from '@angular/common';

@Pipe({
  name: 'formatData',
  standalone: true,
})
export class FormatDataPipe implements PipeTransform {
  // Injetamos os pipes nativos do Angular para reutilizar sua lógica
  constructor(
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe,
    private percentPipe: PercentPipe
  ) {}

  transform(
    value: any,
    dataType?: 'date' | 'currency' | 'weight' | 'percent',
    options?: any
  ): string {
    if (value === null || value === undefined) {
      return '–'; // Retorna um traço para valores nulos/indefinidos
    }

    const locale = options?.locale || 'pt-BR';

    switch (dataType) {
      case 'date':
        return this.datePipe.transform(value, options?.dateFormat || 'dd/MM/yyyy', undefined, locale) ?? '';

      case 'currency':
        return this.currencyPipe.transform(value, options?.currencyCode || 'BRL', 'symbol', '1.2-2', locale) ?? '';

      case 'percent':
        // O PercentPipe espera um valor decimal (ex: 0.75 para 75%)
        return this.percentPipe.transform(value, '1.0-2', locale) ?? '';

      case 'weight':
        return `${value} kg`; // Formatação customizada

      default:
        return value.toString();
    }
  }
}
