import { Component, inject, signal } from '@angular/core';
import { LoggedUserService } from '../../services/logged-user/logged-user.service';

@Component({
  selector: 'user-icon',
  imports: [],
  templateUrl: './user-icon.component.html',
  styleUrl: './user-icon.component.scss'
})
export class UserIconComponent {
  private loggedUser = inject(LoggedUserService)

  profile_picture = signal<string>(
    this.loggedUser.getUser()?.profile_picture ??
    'https://notion-avatar.app/api/svg/eyJmYWNlIjoxMCwibm9zZSI6NCwibW91dGgiOjAsImV5ZXMiOjQsImV5ZWJyb3dzIjowLCJnbGFzc2VzIjowLCJoYWlyIjozLCJhY2Nlc3NvcmllcyI6NywiZGV0YWlscyI6MCwiYmVhcmQiOjcsImZsaXAiOjAsImNvbG9yIjoidHJhbnNwYXJlbnQiLCJzaGFwZSI6ImNpcmNsZSJ9'
  )
}
