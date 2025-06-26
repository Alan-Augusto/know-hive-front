import { Component, computed, effect, inject, signal } from '@angular/core';
import { LoggedUserService } from '../../services/logged-user/logged-user.service';
import { IUser } from '../../entity/user.interface';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { KhButtonComponent } from "../../components/kh-button/kh-button.component";
import { UsersService } from '../../services/users/users.service';
import { IUserStatistics } from '../../entity/userStatistics.interface';
import { HomeCardStatisticComponent, ICardHomeV1 } from './home-card-statistic/home-card-statistic.component';
import { HomeQuestionCardComponent } from "./home-question-card/home-question-card.component";
import { Router } from '@angular/router';
import { HomeTagCardComponent } from "./home-tag-card/home-tag-card.component";
import { HomeCollectionCardComponent } from './home-collection-card/home-collection-card.component';
import { DialogService } from 'primeng/dynamicdialog';
import { QuestionFormComponent } from '../questions/question-form/question-form.component';

@Component({
  selector: 'home-v1',
  imports: [FormsModule, InputTextModule, KhButtonComponent, HomeCardStatisticComponent, HomeQuestionCardComponent, HomeTagCardComponent, HomeCollectionCardComponent],
  providers: [DialogService],
  templateUrl: './home-v1.component.html',
  styleUrl: './home-v1.component.scss'
})
export class HomeV1Component {
  private loggedUserService = inject(LoggedUserService);
  private userService = inject(UsersService);
  private router = inject(Router);
  private dialogService = inject(DialogService)

  // SIGNALS
  data = signal<IUserStatistics | null>(null);
  shortcuts = signal<{ label: string, icon: string, onClick: () => void }[]>([
    {
      label: 'Criar Questão', icon: 'ti ti-pencil', onClick: () => {this.newQuestion();},
    },
    {
      label: 'Criar Coleção', icon: 'ti ti-folder-plus', onClick: () => {this.newCollection();},
    },
    {
      label: 'Gerenciar Questões', icon: 'ti ti-notebook', onClick: () => {this.navigateTo('/questions');},
    },
    {
      label: 'Gerenciar Coleções', icon: 'ti ti-folder', onClick: () => {this.navigateTo('/collections');},
    },
  ]);

  // COMPUTEDS
  user = computed<IUser>(() => this.loggedUserService.loggedUser());
  listCards = computed<ICardHomeV1[]>(() => this.getListCards(this.data()));

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.userService.getUserStatistics(this.user().id).subscribe({
      next: (data) => {
        this.data.set(data as IUserStatistics);
      },
      error: (error) => {
        console.error('Error loading user statistics:', error);
      }
    });
  }

  getListCards(data: IUserStatistics | null): ICardHomeV1[] {
    return [
      {
        title: 'Questões Criadas',
        value: data?.questions_created || 0,
        icon: 'ti ti-progress-help',
        color: '#007bff'
      },
      {
        title: 'Coleções',
        value: data?.collections_created || 0,
        icon: 'ti ti-folder',
        color: '#a259ff'
      },
      {
        title: 'Compartilhadas',
        value: data?.shared_items_count || 0,
        icon: 'ti ti-share',
        color: '#00e18f'
      },
      {
        title: 'Favoritas',
        value: data?.favorites_count || 0,
        icon: 'ti ti-heart',
        color: '#ff6b6b'
      },
      {
        title: 'Respostas Totais',
        value: data?.total_responses || 0,
        icon: 'ti ti-list-details',
        color: '#ffc107'
      },
      {
        title: 'Respostas Corretas',
        value: data?.correct_responses || 0,
        icon: 'ti ti-check',
        color: '#28a745'
      },
      {
        title: 'Precisão',
        value: data?.accuracy_percentage != null
          ? `${Number(data.accuracy_percentage.toFixed(1))}%`
          : '0%',
        icon: 'ti ti-target',
        color: '#17a2b8'
      },
      {
        title: 'Coleções com acesso',
        value: data?.collections_with_access || 0,
        icon: 'ti ti-users-group',
        color: '#fd7e14'
      },
      {
        title: 'Questões com acesso',
        value: data?.questions_with_access || 0,
        icon: 'ti ti-key',
        color: '#6f42c1'
      }
    ];
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  newQuestion(){
    const ref = this.dialogService.open(
      QuestionFormComponent,
      {
      header: '📝 Nova questão',
      modal: true,
      closable: true,
      focusOnShow: false,
      width: '30rem',
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
    });
  }

  newCollection(){
    const ref = this.dialogService.open(
      QuestionFormComponent,
      {
        header: '📚 Nova coleção',
        modal: true,
        closable: true,
        focusOnShow: false,
        width: '30rem',
        breakpoints: {
          '960px': '75vw',
          '640px': '90vw'
        },
      }
    );

  }

}
