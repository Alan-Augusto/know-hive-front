import { Component, inject, signal, computed, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionResponseService } from '../../../services/question-response/question-response.service';
import { IQuestionStats } from '../../../entity/questionResponse.interface';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AccordionModule } from 'primeng/accordion';
import {
  Chart,
  ChartConfiguration,
  ChartType,
  registerables
} from 'chart.js';
import { SkeletonModule } from 'primeng/skeleton';

Chart.register(...registerables);

@Component({
  selector: 'question-statistics',
  imports: [CommonModule, SkeletonModule, AccordionModule],
  templateUrl: './question-statistics.component.html',
  styleUrl: './question-statistics.component.scss'
})
export class QuestionStatisticsComponent implements AfterViewInit {

  @ViewChild('accuracyChart', { static: false }) accuracyChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('alternativesChart', { static: false }) alternativesChartRef!: ElementRef<HTMLCanvasElement>;

  private questionResponseService = inject(QuestionResponseService);
  private dynamicDialogConfig = inject(DynamicDialogConfig);

  data = signal<IQuestionStats | null>(null);
  isLoading = signal<boolean>(true);

  // Computed values for easier access to stats
  accuracyPercentage = computed(() => this.data()?.accuracy_percentage || 0);
  totalResponses = computed(() => this.data()?.total_responses || 0);
  correctResponses = computed(() => this.data()?.correct_responses || 0);
  incorrectResponses = computed(() => this.data()?.incorrect_responses || 0);
  averageTime = computed(() => {
    const avgSeconds = this.data()?.average_time_seconds || 0;
    return this.formatTime(avgSeconds);
  });

  // Charts
  private accuracyChart: Chart | null = null;
  private alternativesChart: Chart | null = null;

  ngOnInit() {
    const data = this.dynamicDialogConfig.data;
    if (data?.questionId) {
      this.loadStats(data.questionId);
    }
  }

  ngAfterViewInit() {
    // Charts will be created after data is loaded
  }

  loadStats(id: string) {
    this.isLoading.set(true);
    this.questionResponseService.getQuestionStats(id).subscribe({
      next: (stats) => {
        this.data.set(stats);
        setTimeout(() => {
          this.isLoading.set(false);
        }, 100); // Small delay to ensure DOM is ready

        setTimeout(() => {
          this.createCharts();
        }, 200); // Small delay to ensure DOM is ready
      },
      error: (err) => {
        console.error('Error loading question stats:', err);
        this.isLoading.set(false);
      }
    });
  }

  private createCharts() {
    if (this.data()) {
      this.createAccuracyChart();
      this.createAlternativesChart();
    }
  }

  private createAccuracyChart() {
    if (!this.accuracyChartRef?.nativeElement) return;

    const ctx = this.accuracyChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart
    if (this.accuracyChart) {
      this.accuracyChart.destroy();
    }

    const correct = this.correctResponses();
    const incorrect = this.incorrectResponses();

    const config: ChartConfiguration = {
      type: 'doughnut' as ChartType,
      data: {
        labels: ['Corretas', 'Incorretas'],
        datasets: [{
          data: [correct, incorrect],
          backgroundColor: [
            '#9cffa1',
            '#f78181'
          ],
          borderWidth: 0,
          borderRadius: 10,
          hoverOffset: 4,
          spacing: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true
            }
          }
        }
      }
    };

    this.accuracyChart = new Chart(ctx, config);
  }

  private createAlternativesChart() {
    if (!this.alternativesChartRef?.nativeElement || !this.data()?.alternative_stats) return;

    const ctx = this.alternativesChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart
    if (this.alternativesChart) {
      this.alternativesChart.destroy();
    }

    const alternativeStats = this.data()!.alternative_stats;
    const labels = alternativeStats.map(alt => alt.text);
    const responseData = alternativeStats.map(alt => alt.selection_count);
    const colors = alternativeStats.map(alt => alt.is_correct ? '#9cffa1' : '#f78181');

    const config: ChartConfiguration = {
      type: 'bar' as ChartType,
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Respostas por Alternativa',
            data: responseData,
            backgroundColor: colors,
            borderRadius: 8,
            borderSkipped: false,
            barPercentage: 0.6,
            categoryPercentage: 0.6,
            borderWidth: 0,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#22223b',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#9cffa1',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8
          }
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: getComputedStyle(document.documentElement).getPropertyValue('--p-text-base').trim() || '#22223b',
              font: {
                family: 'Geist, sans-serif',
                weight: 'normal',
              }
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: getComputedStyle(document.documentElement).getPropertyValue('--p-text-secondary').trim() || '#22223b',
            },
            ticks: {
              stepSize: 1,
              color: getComputedStyle(document.documentElement).getPropertyValue('--p-text-base').trim() || '#22223b',
            }
          }
        }
      }
    };

    this.alternativesChart = new Chart(ctx, config);
  }

  private formatTime(seconds: number): string {
    if (seconds < 60) {
      return `${Math.round(seconds)}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  }

  private truncateText(text: string, maxLength: number): string {
    return text;
  }

  ngOnDestroy() {
    if (this.accuracyChart) {
      this.accuracyChart.destroy();
    }
    if (this.alternativesChart) {
      this.alternativesChart.destroy();
    }
  }
}
