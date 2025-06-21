import { Component, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'button-like',
  imports: [CommonModule],
  templateUrl: './button-like.component.html',
  styleUrl: './button-like.component.scss'
})
export class ButtonLikeComponent {
  liked = model<boolean>(false);
  onLike = output<boolean>();
  showParticles = false;
  particles = Array(6).fill(0); // 6 partículas

  toggleLike() {
    this.liked.set(!this.liked());
    this.onLike.emit(this.liked());

    // Se foi curtido, mostra as partículas
    if (this.liked()) {
      this.triggerParticles();
    }
  }

  private triggerParticles() {
    this.showParticles = true;

    // Remove as partículas após a animação
    setTimeout(() => {
      this.showParticles = false;
    }, 1000);
  }

  getParticleStyle(index: number) {
    const angle = (index * 60) - 30; // Distribui as partículas em ângulos diferentes
    const distance = 40 + (index * 5); // Diferentes distâncias

    return {
      '--angle': `${angle}deg`,
      '--distance': `${distance}px`,
      '--delay': `${index * 100}ms`
    };
  }
}
