import { Component } from '@angular/core';
import { KhButtonComponent } from "../kh-button/kh-button.component";

@Component({
    selector: 'button-demo',
    templateUrl: './button-theme.component.html',
    styleUrl: './button-theme.component.scss',
    standalone: true,
    imports: [KhButtonComponent],
})
export class ButtonTheme {
    theme:'light'|'dark' = 'light'
    toggleDarkMode() {
        const element = document.querySelector('html');
        element?.classList.toggle('my-app-dark');
        this.theme = this.theme === 'light' ? 'dark' : 'light';
    }
}