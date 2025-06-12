import { Component, computed, inject, signal } from '@angular/core';
import { LoggedUserService } from '../../../services/logged-user/logged-user.service';
import { Observable } from 'rxjs';
import { ColumnDefinition } from '../../dynamic-data-view/dynamic-data-view.interface';

export class BaseListComponent<T = any> {
  // Services
  private loggedUserService = inject(LoggedUserService);

  // Signals
  searchTerm = signal<string>('');
  optionSelect = signal<string>('');
  displayMode = signal<'table' | 'card'>('card');
  dataSource = signal<T[]>([]);
  columnDefs = signal<ColumnDefinition[]>([]);

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
    asyncMethod().subscribe({
      next: (data: T[]) => {
        this.dataSource.set(data);
      },
      error: (error) => {
        console.error('Error loading data:', error);
      }
    });
  }
}
