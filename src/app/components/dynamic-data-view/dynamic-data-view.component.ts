import { ChangeDetectionStrategy, Component, input, output, TemplateRef } from '@angular/core';
import { FormatDataPipe } from './format-data.pipe';
import { CommonModule, CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { ColumnDefinition, ActionDefinition } from './dynamic-data-view.interface';
import { GetNestedPropertyPipe } from './get-nested-property.pipe';
import { KhButtonComponent } from "../kh-button/kh-button.component";

@Component({
  selector: 'dynamic-data-view',
  standalone: true,
  imports: [CommonModule, FormatDataPipe, GetNestedPropertyPipe, KhButtonComponent], // Importa o pipe aqui
  changeDetection: ChangeDetectionStrategy.OnPush, // Ideal para componentes baseados em Signals
  providers: [DatePipe, CurrencyPipe, PercentPipe], // Fornece os pipes para o FormatDataPipe
  templateUrl: './dynamic-data-view.component.html',
  styleUrl: './dynamic-data-view.component.scss'
})
export class DynamicDataViewComponent <T extends { id: any }> {

  data = input.required<T[]>();

  /** Array de objetos que define cada coluna/campo. */
  columnDefs = input.required<ColumnDefinition<T>[]>();

  /** Array de ações disponíveis para cada linha */
  actions = input<ActionDefinition<T>[]>([]);

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

  /**
   * Executa uma ação específica em um item
   * @param action A definição da ação
   * @param item O item sobre o qual a ação será executada
   * @param event O evento de clique (para prevenir propagação)
   */
  onActionClick(action: ActionDefinition<T>, item: T, event: Event): void {
    event.stopPropagation(); // Previne o clique na linha

    if (action.disabled && action.disabled(item)) {
      return;
    }

    action.onClick(item);
  }

  /**
   * Verifica se uma ação está desabilitada para um item específico
   * @param action A definição da ação
   * @param item O item a ser verificado
   */
  isActionDisabled(action: ActionDefinition<T>, item: T): boolean {
    return action.disabled ? action.disabled(item) : false;
  }
}

/**
 * Componente de visualização dinâmica de dados
 *
 * ATUALIZAÇÃO: Agora as células da tabela usam text-overflow: ellipsis por padrão
 *
 * Características:
 * - Os textos não quebram mais linha por padrão
 * - Quando o texto é maior que a célula, aparece "..." (ellipsis)
 * - A largura das colunas é respeitada, mesmo em telas menores
 * - Para permitir quebra de texto em colunas específicas, use a propriedade `allowWrap: true`
 *
 * Exemplo de uso:
 * ```typescript
 * this.columnDefs.set([
 *   {
 *     field: 'title',
 *     header: 'Título',
 *     width: '30%',
 *     // Esta coluna usará ellipsis (comportamento padrão)
 *   },
 *   {
 *     field: 'description',
 *     header: 'Descrição',
 *     width: '50%',
 *     allowWrap: true // Esta coluna permitirá quebra de linha
 *   }
 * ]);
 * ```
 */
