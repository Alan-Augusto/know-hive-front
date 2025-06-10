import { ChangeDetectionStrategy, Component, input, output, TemplateRef } from '@angular/core';
import { FormatDataPipe } from './format-data.pipe';
import { CommonModule, CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { ColumnDefinition } from './dynamic-data-view.interface';
import { GetNestedPropertyPipe } from './get-nested-property.pipe';

@Component({
  selector: 'dynamic-data-view',
  standalone: true,
  imports: [CommonModule, FormatDataPipe, GetNestedPropertyPipe ], // Importa o pipe aqui
  changeDetection: ChangeDetectionStrategy.OnPush, // Ideal para componentes baseados em Signals
  providers: [DatePipe, CurrencyPipe, PercentPipe], // Fornece os pipes para o FormatDataPipe
  templateUrl: './dynamic-data-view.component.html',
  styleUrl: './dynamic-data-view.component.scss'
})
export class DynamicDataViewComponent <T extends { id: any }> {

  data = input.required<T[]>();

  /** Array de objetos que define cada coluna/campo. */
  columnDefs = input.required<ColumnDefinition<T>[]>();

  /** O modo de visualização: 'table' ou 'card'. Default: 'table' */
  viewMode = input<'table' | 'card'>('table');

  /** Um ng-template opcional para customizar a exibição do card. */
  cardTemplate = input<TemplateRef<{ $implicit: T }>>();

  /** Exibe um indicador de carregamento. Default: false */
  isLoading = input<boolean>(false);

  /** Emitido quando o usuário clica em uma linha da tabela ou em um card. */
  itemClick = output<T>();

  // --- MÉTODOS ---

  /**
   * Delega a emissão do evento de clique.
   * @param item O objeto de dados do item clicado.
   */
  onItemClicked(item: T): void {
    this.itemClick.emit(item);
  }
}
