import { Component, computed, inject, signal } from '@angular/core';
import { LoggedUserService } from '../../../services/logged-user/logged-user.service';

export class BaseListComponent<T = any> {

    private loggedUserService = inject(LoggedUserService);

    user = computed(() => this.loggedUserService.loggedUser());

    searchTerm = signal<string>('');

    optionSelect = signal<string>('');

    displayMode = signal<'card' | 'list'>('card');

    setSearchTerm(term: string): void {
      this.searchTerm.set(term);
    }

    setOptionSelect(option: string): void {
      this.optionSelect.set(option);
    }

    dataSource = signal<T[]>([]);

}
