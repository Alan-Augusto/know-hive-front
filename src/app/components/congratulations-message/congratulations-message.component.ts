import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'congratulations-message',
  imports: [CommonModule],
  templateUrl: './congratulations-message.component.html',
  styleUrl: './congratulations-message.component.scss'
})
export class CongratulationsMessageComponent implements OnInit, OnDestroy, OnChanges {
  @Input() show: boolean = false;
  @Input() duration: number = 3000;
  @Input() message: string = 'Parabéns!';

  confettiPieces: Array<{
    id: number;
    left: string;
    delay: string;
    duration: string;
    type: number;
  }> = [];
  isVisible: boolean = false;
  ngOnInit() {
    // Criar array para os confetes com propriedades fixas
    this.confettiPieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      duration: `${2 + Math.random() * 2}s`,
      type: i % 6
    }));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['show']) {
      this.showConfetti(this.show);
    }
  }

  ngOnDestroy() {
    // Cleanup se necessário
  }

  showConfetti(isVisible: boolean) {
    this.isVisible = isVisible;
  }
}
