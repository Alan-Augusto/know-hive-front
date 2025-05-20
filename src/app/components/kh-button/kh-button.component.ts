import { Component, input } from '@angular/core';

@Component({
  selector: 'kh-button',
  imports: [],
  templateUrl: './kh-button.component.html',
  styleUrl: './kh-button.component.scss'
})
export class KhButtonComponent {
  type = input<'primary' | 'secondary' | 'tertiary' | 'accent' | 'danger'>('primary');
  size = input<'small' | 'medium' | 'large'>('medium');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  label = input<string | null>(null);
}
