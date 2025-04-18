import { Component } from '@angular/core';

@Component({
    selector: 'button-demo',
    templateUrl: './button-demo.component.html',
    styleUrl: './button-demo.component.scss',
    standalone: true,
})
export class ButtonDemo {
    theme:'light'|'dark' = 'light'
    toggleDarkMode() {
        const element = document.querySelector('html');
        element?.classList.toggle('my-app-dark');
        this.theme = this.theme === 'light' ? 'dark' : 'light';
    }
}