import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonDemo } from "./components/button-demo/button-demo.component";

@Component({
  selector: 'app-root',
  imports: [
    // RouterOutlet, 
    ButtonDemo, 
    ButtonDemo],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'teste_projeto_angular';
}
