import { Component, inject } from '@angular/core';
import { PopoverModule } from 'primeng/popover';
import { ColorService } from '../../services/style/color.service';

@Component({
  selector: 'button-color',
  imports: [PopoverModule],
  templateUrl: './button-color.component.html',
  styleUrl: './button-color.component.scss'
})
export class ButtonColorComponent {

  private colorService = inject(ColorService);

  colorsOptions = this.colorService.getColorsOptions();

  toggleColor(color: string) {
    this.colorService.setColor(color);
  }

}
