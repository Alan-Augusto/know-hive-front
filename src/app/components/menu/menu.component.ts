import { Component, signal } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'menu',
  imports: [TooltipModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  isExpanded = signal(false);
}
