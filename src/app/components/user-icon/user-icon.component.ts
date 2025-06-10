import { Component, computed, inject, signal } from '@angular/core';
import { LoggedUserService } from '../../services/logged-user/logged-user.service';
import { MenuModule } from 'primeng/menu';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { DialogService } from 'primeng/dynamicdialog';
import { UserEditComponent } from '../../features/user-edit/user-edit.component';

interface MenuOption {
  label: string;
  icon: string; // google icons
  command: () => void;
}
@Component({
  selector: 'user-icon',
  imports: [MenuModule, TieredMenuModule],
  providers: [DialogService],
  templateUrl: './user-icon.component.html',
  styleUrl: './user-icon.component.scss'
})
export class UserIconComponent {
  private loggedUser = inject(LoggedUserService)
  private dialogService = inject(DialogService)

  profile_picture = computed<string>(()=> this.loggedUser.loggedUser()?.profile_picture ??
    'https://notion-avatar.app/api/svg/eyJmYWNlIjoxMCwibm9zZSI6NCwibW91dGgiOjAsImV5ZXMiOjQsImV5ZWJyb3dzIjowLCJnbGFzc2VzIjowLCJoYWlyIjozLCJhY2Nlc3NvcmllcyI6NywiZGV0YWlscyI6MCwiYmVhcmQiOjcsImZsaXAiOjAsImNvbG9yIjoidHJhbnNwYXJlbnQiLCJzaGFwZSI6ImNpcmNsZSJ9'
  )

  menuOptions = signal<MenuOption[]>([
    {
      label: 'Editar usuário',
      icon: 'ti ti-user-edit',
      command: () => {
        this.dialogService.open(
              UserEditComponent,
              {
                header: 'Editar usuário',
                modal:true,
                closable: true,
                focusOnShow: false,
                breakpoints: {
                    '960px': '75vw',
                    '640px': '90vw'
                },
              });
      }
    },
    {
      label: 'Sair',
      icon: 'ti ti-logout-2',
      command: () => {
        this.loggedUser.logout();
      }
    }
  ])


}
