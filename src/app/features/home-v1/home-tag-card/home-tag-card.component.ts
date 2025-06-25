import { Component, computed, input, signal } from '@angular/core';
import { IMostUsedTag } from '../../../entity/userStatistics.interface';

@Component({
  selector: 'home-tag-card',
  imports: [],
  templateUrl: './home-tag-card.component.html',
  styleUrl: './home-tag-card.component.scss'
})
export class HomeTagCardComponent {
  tag = input.required<IMostUsedTag>();
  index = input.required<number>();

  colorsList = signal<string[]>([
    '#007bff',
    '#a259ff',
    '#00e18f',
    '#ff6b6b',
    '#ffc107',
    '#28a745',
    '#17a2b8',
    '#fd7e14',
    '#6f42c1'
  ]);

  backgroundColor = computed(() => {
    // Adiciona opacidade de 10% (hex: 1A) ao final da cor
    return this.colorsList()[this.index()] + '1A';
  });

  color = computed(() => {
    return this.colorsList()[this.index()];
  });

  name = computed(() => {this.tag().name.replace(/-/g, ' ')});
}
