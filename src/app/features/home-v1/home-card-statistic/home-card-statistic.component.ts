import { Component, computed, input } from '@angular/core';

export interface ICardHomeV1 {
  title: string;
  value: number | string;
  icon: string;
  color: string;
  onClick?: () => void;
}

@Component({
  selector: 'home-card-statistic',
  imports: [],
  templateUrl: './home-card-statistic.component.html',
  styleUrl: './home-card-statistic.component.scss'
})
export class HomeCardStatisticComponent {
  value = input.required<ICardHomeV1>();

  backgroundColor = computed<string>(() => {
    // a cor recebida em this.value().color será um hexadecimal, precisamos retorna essa mesma cor porém com opacidade de 0,1
    const color = this.value().color;
    if (color.startsWith('#')) {
      return `${color}1A`; // Adiciona opacidade de 0.1
    } else if (color.startsWith('rgb')) {
      const rgbValues = color.match(/\d+/g);
      if (rgbValues) {
        return `rgba(${rgbValues.join(', ')}, 0.1)`; // Adiciona opacidade de 0.1
      }
    }
    // Se não for um formato reconhecido, retorna uma cor padrão
    return'#FFFFFF1A'; // Branco com opacidade de 0.1
  });

}
