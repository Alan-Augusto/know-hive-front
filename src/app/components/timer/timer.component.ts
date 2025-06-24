import { Component, model, OnInit, OnDestroy, ElementRef } from '@angular/core';

@Component({
  selector: 'timer',
  imports: [],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss'
})
export class TimerComponent implements OnInit, OnDestroy {

  time = model<number>(0);
  private timerInterval: any;
  private startTime: number = 0;

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  startTimer() {
    this.clearTimer();
    this.startTime = Date.now();
    this.timerInterval = setInterval(() => {
      this.time.set(Math.floor((Date.now() - this.startTime) / 1000));
    }, 1000);
  }

  // Método público que pode ser chamado pelo componente pai
  public resetTimer() {
    this.time.set(0);
    this.startTimer();
  }

  // Método público para pausar o timer
  public pauseTimer() {
    this.clearTimer();
  }

  // Método público para obter o tempo atual
  public getCurrentTime(): number {
    return this.time();
  }

  private clearTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

}
