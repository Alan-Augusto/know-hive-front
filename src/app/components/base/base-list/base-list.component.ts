import { Component, computed, inject, signal } from '@angular/core';
import { LoggedUserService } from '../../../services/logged-user/logged-user.service';
import { Observable } from 'rxjs';
import { ActionDefinition, ColumnDefinition } from '../../dynamic-data-view/dynamic-data-view.interface';

export class BaseListComponent<T = any> {
  // Services
  private loggedUserService = inject(LoggedUserService);

  // Signals
  searchTerm = signal<string>('');
  optionSelect = signal<string>('');
  displayMode = signal<'table' | 'card'>('card');
  dataSourceBkp = signal<T[]>([]);
  dataSource = computed<T[]>(()=> this.filterDataSource(this.dataSourceBkp(), this.searchTerm()));
  columnDefs = signal<ColumnDefinition[]>([]);
  actionsDef = signal<ActionDefinition[]>([]);
  loadingData = signal<boolean>(false);

  // Computed properties
  user = computed(() => this.loggedUserService.loggedUser());
  iconDisplayMode = computed(() => this.displayMode() === 'card' ? 'ti ti-list' : 'ti ti-layout-grid');

  // Methods
  toggleDisplayMode(): void {
    this.displayMode.set(this.displayMode() === 'card' ? 'table' : 'card');
  }

  setSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }

  setOptionSelect(option: string): void {
    this.optionSelect.set(option);
  }

  loadData(asyncMethod: () => Observable<T[]>): void {
    this.loadingData.set(true);
    asyncMethod().subscribe({
      next: (data: T[]) => {
        // this.dataSource.set(data);
        this.dataSourceBkp.set(data);
        this.loadingData.set(false);
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.loadingData.set(false);
      }

    });
  }

  filterDataSource(data: T[], searchTerm: string): T[] {
    if (!searchTerm) {
      return data;
    }
    const lowerCaseTerm = searchTerm.toLowerCase();
    return data.filter(item => {
      return Object.values(item as Record<string, unknown>).some(value =>
        typeof value === 'string' && value.toLowerCase().includes(lowerCaseTerm)
      );
    });
  }
}
