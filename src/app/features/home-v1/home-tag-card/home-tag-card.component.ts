import { Component, input } from '@angular/core';
import { IMostUsedTag } from '../../../entity/userStatistics.interface';

@Component({
  selector: 'home-tag-card',
  imports: [],
  templateUrl: './home-tag-card.component.html',
  styleUrl: './home-tag-card.component.scss'
})
export class HomeTagCardComponent {
  tag = input.required<IMostUsedTag>();
}
