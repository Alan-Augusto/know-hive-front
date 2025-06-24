import { Component, computed, effect, inject, signal } from '@angular/core';
import { LoggedUserService } from '../../services/logged-user/logged-user.service';
import { IUser } from '../../entity/user.interface';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { KhButtonComponent } from "../../components/kh-button/kh-button.component";
import { UsersService } from '../../services/users/users.service';
import { IUserStatistics } from '../../entity/userStatistics.interface';
import { HomeCardStatisticComponent, ICardHomeV1 } from './home-card-statistic/home-card-statistic.component';

@Component({
  selector: 'home-v1',
  imports: [FormsModule, InputTextModule, KhButtonComponent, HomeCardStatisticComponent],
  templateUrl: './home-v1.component.html',
  styleUrl: './home-v1.component.scss'
})
export class HomeV1Component{
  private loggedUserService = inject(LoggedUserService);
  private userService = inject(UsersService);

  // SIGNALS
  data = signal<IUserStatistics|null>(null);

  // COMPUTEDS
  user = computed<IUser>(() => this.loggedUserService.loggedUser());
  listCards = computed<ICardHomeV1[]>(() => this.getListCards(this.data()));

  ngOnInit() {
    this.loadData();
  }

  loadData(){
    this.userService.getUserStatistics(this.user().id).subscribe({
      next: (data) => {
        this.data.set(data as IUserStatistics);
        console.log('User statistics loaded:', data);
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
      }
    ]
  }

}
