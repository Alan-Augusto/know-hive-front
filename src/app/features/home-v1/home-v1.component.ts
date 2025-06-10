import { Component, computed, effect, inject, signal } from '@angular/core';
import { LoggedUserService } from '../../services/logged-user/logged-user.service';
import { IUser } from '../../entity/user.interface';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { KhButtonComponent } from "../../components/kh-button/kh-button.component";
import { ListQuestionsComponent } from './list-questions/list-questions.component';
import { ListCollectionComponent } from './list-collection/list-collection.component';
import { ListShareWithMeComponent } from './list-share-with-me/list-share-with-me.component';
import { BaseListComponent } from '../../components/base/base-list/base-list.component';

@Component({
  selector: 'home-v1',
  imports: [FormsModule, InputTextModule, KhButtonComponent, ListQuestionsComponent, ListCollectionComponent, ListShareWithMeComponent],
  templateUrl: './home-v1.component.html',
  styleUrl: './home-v1.component.scss'
})
export class HomeV1Component extends BaseListComponent{

}
