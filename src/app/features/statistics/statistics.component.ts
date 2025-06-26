import { Component, computed, inject, signal, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { LoggedUserService } from '../../services/logged-user/logged-user.service';
import { UsersService } from '../../services/users/users.service';
import { IUser } from '../../entity/user.interface';
import { IUserStatistics } from '../../entity/userStatistics.interface';
import { HomeCardStatisticComponent, ICardHomeV1 } from '../home-v1/home-card-statistic/home-card-statistic.component';
import { Router } from '@angular/router';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'statistics',
  imports: [HomeCardStatisticComponent],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent implements AfterViewInit {
  @ViewChild('performanceChart', { static: false }) performanceChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('tagsChart', { static: false }) tagsChartRef!: ElementRef<HTMLCanvasElement>;

  private loggedUserService = inject(LoggedUserService);
  private userService = inject(UsersService);
  private router = inject(Router);

  // Charts instances
  private performanceChart: Chart | null = null;
  private tagsChart: Chart | null = null;

  // SIGNALS
  data = signal<IUserStatistics | null>(null);
  loading = signal<boolean>(true);

  // COMPUTEDS
  user = computed<IUser>(() => this.loggedUserService.loggedUser());

  // Estatísticas principais - métricas gerais
  generalStats = computed<ICardHomeV1[]>(() => {
    const data = this.data();
    if (!data) return [];

    return [
      {
        title: 'Questões Criadas',
        value: data.questions_created || 0,
        icon: 'ti ti-pencil',
        color: '#007bff'
      },
      {
        title: 'Coleções Criadas',
        value: data.collections_created || 0,
        icon: 'ti ti-folder-plus',
        color: '#a259ff'
      },
      {
        title: 'Total de Respostas',
        value: data.total_responses || 0,
        icon: 'ti ti-list-details',
        color: '#ffc107'
      },
      {
        title: 'Respostas Corretas',
        value: data.correct_responses || 0,
        icon: 'ti ti-check',
        color: '#28a745'
      }
    ];
  });

  // Estatísticas de performance
  performanceStats = computed<ICardHomeV1[]>(() => {
    const data = this.data();
    if (!data) return [];

    const accuracy = data.accuracy_percentage != null
      ? `${Number(data.accuracy_percentage.toFixed(1))}%`
      : '0%';

    const incorrectResponses = (data.total_responses || 0) - (data.correct_responses || 0);

    return [
      {
        title: 'Taxa de Acertos',
        value: accuracy,
        icon: 'ti ti-target',
        color: '#17a2b8'
      },
      {
        title: 'Respostas Incorretas',
        value: incorrectResponses,
        icon: 'ti ti-x',
        color: '#dc3545'
      }
    ];
  });

  // Estatísticas de compartilhamento
  sharingStats = computed<ICardHomeV1[]>(() => {
    const data = this.data();
    if (!data) return [];

    return [
      {
        title: 'Itens Compartilhados',
        value: data.shared_items_count || 0,
        icon: 'ti ti-share',
        color: '#00e18f'
      },
      {
        title: 'Itens Favoritos',
        value: data.favorites_count || 0,
        icon: 'ti ti-heart',
        color: '#ff6b6b'
      },
      {
        title: 'Coleções com Acesso',
        value: data.collections_with_access || 0,
        icon: 'ti ti-users-group',
        color: '#fd7e14'
      },
      {
        title: 'Questões com Acesso',
        value: data.questions_with_access || 0,
        icon: 'ti ti-key',
        color: '#6f42c1'
      }
    ];
  });

  // Top tags mais utilizadas
  topTags = computed(() => {
    const data = this.data();
    return data?.most_used_tags || [];
  });

  ngOnInit() {
    this.loadStatistics();
  }

  ngAfterViewInit() {
    // Charts will be created after data loads
  }

  loadStatistics() {
    this.loading.set(true);
    this.userService.getUserStatistics(this.user().id).subscribe({
      next: (data) => {
        this.data.set(data as IUserStatistics);
        this.loading.set(false);
        // Create charts after data loads
        setTimeout(() => {
          this.createCharts();
        }, 200);
      },
      error: (error) => {
        console.error('Erro ao carregar estatísticas:', error);
        this.loading.set(false);
      }
    });
  }

  private createCharts() {
    if (this.data()) {
      this.createPerformanceChart();
      this.createTagsChart();
    }
  }

  private createPerformanceChart() {
    if (!this.performanceChartRef?.nativeElement) return;

    const ctx = this.performanceChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart
    if (this.performanceChart) {
      this.performanceChart.destroy();
    }

    const data = this.data()!;
    const correct = data.correct_responses || 0;
    const incorrect = (data.total_responses || 0) - correct;

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
              usePointStyle: true,
              color: getComputedStyle(document.documentElement).getPropertyValue('--p-text-base').trim() || '#22223b',
              font: {
                family: 'Geist, sans-serif',
                weight: 'normal',
              }
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
        }
      }
    };

    this.performanceChart = new Chart(ctx, config);
  }

  private createTagsChart() {
    if (!this.tagsChartRef?.nativeElement || !this.data()?.most_used_tags?.length) return;

    const ctx = this.tagsChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart
    if (this.tagsChart) {
      this.tagsChart.destroy();
    }

    const topTags = this.data()!.most_used_tags.slice(0, 5);
    const labels = topTags.map(tag => tag.name);
    const values = topTags.map(tag => tag.usage_count);

    const config: ChartConfiguration = {
      type: 'bar' as ChartType,
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Uso das Tags',
            data: values,
            backgroundColor: '#9cffa1',
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
            cornerRadius: 8,
            callbacks: {
              label: (context) => {
                return `${context.parsed.y} usos`;
              }
            }
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
              color: getComputedStyle(document.documentElement).getPropertyValue('--p-surface-secondary').trim() || '#f0f0f0',
            },
            ticks: {
              stepSize: 1,
              color: getComputedStyle(document.documentElement).getPropertyValue('--p-text-base').trim() || '#22223b',
              font: {
                family: 'Geist, sans-serif',
                weight: 'normal',
              }
            }
          }
        }
      }
    };

    this.tagsChart = new Chart(ctx, config);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  ngOnDestroy() {
    if (this.performanceChart) {
      this.performanceChart.destroy();
    }
    if (this.tagsChart) {
      this.tagsChart.destroy();
    }
  }
}
