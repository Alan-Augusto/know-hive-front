import { Component, inject, signal, computed, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionResponseService } from '../../../services/question-response/question-response.service';
import { ICollectionStats } from '../../../entity/questionResponse.interface';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import {
  Chart,
  ChartConfiguration,
  ChartType,
  registerables
} from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'collection-statistics',
  imports: [CommonModule],
  templateUrl: './collection-statistics.component.html',
  styleUrl: './collection-statistics.component.scss'
})
export class CollectionStatisticsComponent implements AfterViewInit {

  @ViewChild('accuracyChart', { static: false }) accuracyChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('questionsChart', { static: false }) questionsChartRef!: ElementRef<HTMLCanvasElement>;

  private questionResponseService = inject(QuestionResponseService);
  private dynamicDialogConfig = inject(DynamicDialogConfig);

  data = signal<ICollectionStats|null>(null);
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
  private questionsChart: Chart | null = null;

  ngOnInit() {
    const data = this.dynamicDialogConfig.data;
    if (data?.collectionId) {
      this.loadStats(data.collectionId);
    }
  }

  ngAfterViewInit() {
    // Charts will be created after data is loaded
  }

  loadStats(id: string) {
    this.isLoading.set(true);
    this.questionResponseService.getCollectionStats(id).subscribe({
      next: (stats) => {
        this.data.set(stats);
        this.isLoading.set(false);
        setTimeout(() => this.createCharts(), 100); // Small delay to ensure DOM is ready
      },
      error: (err) => {
        console.error('Error loading collection stats:', err);
        this.isLoading.set(false);
      }
    });
  }

  private createCharts() {
    if (this.data()) {
      this.createAccuracyChart();
      this.createQuestionsChart();
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

  private createQuestionsChart() {
    if (!this.questionsChartRef?.nativeElement || !this.data()?.question_stats) return;

    const ctx = this.questionsChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart
    if (this.questionsChart) {
      this.questionsChart.destroy();
    }

    const questionStats = this.data()!.question_stats;
    const labels = questionStats.map(q => this.truncateText(q.question_title, 20));
    const correctData = questionStats.map(q => q.correct_responses);
    const totalData = questionStats.map(q => q.total_responses);

    const config: ChartConfiguration = {
      type: 'bar' as ChartType,
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Respostas Corretas',
            data: correctData,
            backgroundColor: '#9cffa1', // verde claro, igual ao doughnut
            borderRadius: 8,
            borderSkipped: false,
            barPercentage: 0.6,
            categoryPercentage: 0.6,
            borderWidth: 0,
            // hoverBackgroundColor: 'rgba(34, 197, 94, 1)'
          },
          {
            label: 'Total de Respostas',
            data: totalData,
            backgroundColor: '#73beff', // azul claro, mais suave
            borderRadius: 8,
            borderSkipped: false,
            barPercentage: 0.6,
            categoryPercentage: 0.6,
            borderWidth: 0,
            // hoverBackgroundColor: 'rgba(99, 102, 241, 0.4)'
          }
        ]
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
              display: false
            },
            ticks: {
              color: '#22223b',
              font: {
                weight: 'bold'
              }
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: '#f1f5f9',
              // borderDash: [4, 4]
            },
            ticks: {
              stepSize: 1,
              color: '#22223b'
            }
          }
        }
      }
    };

    this.questionsChart = new Chart(ctx, config);
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
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  ngOnDestroy() {
    if (this.accuracyChart) {
      this.accuracyChart.destroy();
    }
    if (this.questionsChart) {
      this.questionsChart.destroy();
    }
  }
}
