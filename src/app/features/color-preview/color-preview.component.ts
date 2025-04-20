import { Component } from '@angular/core';
import { ButtonTheme } from '../../components/button-theme/button-theme.component';
import { ButtonColorComponent } from '../../components/button-color/button-color.component';
import { KhButtonComponent } from '../../components/kh-button/kh-button.component';

@Component({
  selector: 'app-color-preview',
  imports: [ButtonTheme, ButtonColorComponent, KhButtonComponent],
  templateUrl: './color-preview.component.html',
  styleUrl: './color-preview.component.scss'
})
export class ColorPreviewComponent {

}
