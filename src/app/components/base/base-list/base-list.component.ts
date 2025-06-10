import { Component, computed, inject, signal } from '@angular/core';
import { LoggedUserService } from '../../../services/logged-user/logged-user.service';

export class BaseListComponent<T = any> {
  // Services
  private loggedUserService = inject(LoggedUserService);

  // Signals
  searchTerm = signal<string>('');
  optionSelect = signal<string>('');
  displayMode = signal<'card' | 'list'>('card');
  dataSource = signal<T[]>([]);

  // Computed properties
  user = computed(() => this.loggedUserService.loggedUser());
  iconDisplayMode = computed(() => this.displayMode() === 'card' ? 'ti ti-list' : 'ti ti-layout-grid');

  // Methods
  toggleDisplayMode(): void {
    this.displayMode.set(this.displayMode() === 'card' ? 'list' : 'card');
  }

  setSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }

  setOptionSelect(option: string): void {
    this.optionSelect.set(option);
  }
}
