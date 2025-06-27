import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { KhButtonComponent } from '../../components/kh-button/kh-button.component';
import { CollectionsService } from '../../services/collections/collections.service';
import { QuestionsService } from '../../services/questions/questions.service';
import { LoggedUserService } from '../../services/logged-user/logged-user.service';
import { ICollection } from '../../entity/collection.interface';
import { IQuestion } from '../../entity/question.interface';
import { IPublicSearch } from '../../entity/publicSearch.interface';
import { ILikeCollection } from '../../entity/likeCollection.interface';
import { ILikeQuestion } from '../../entity/likeQuestion.interface';
import { IUser } from '../../entity/user.interface';
import { forkJoin } from 'rxjs';
import { ButtonLikeComponent } from '../../components/button-like/button-like.component';
import { HomeCollectionCardComponent } from '../home-v1/home-collection-card/home-collection-card.component';

@Component({
  selector: 'public-search',
  imports: [
    FormsModule,
    InputTextModule,
    KhButtonComponent,
    ButtonLikeComponent,
    HomeCollectionCardComponent
  ],
  templateUrl: './public-search.component.html',
  styleUrl: './public-search.component.scss'
})
export class PublicSearchComponent {
  private collectionsService = inject(CollectionsService);
  private questionsService = inject(QuestionsService);
  private loggedUserService = inject(LoggedUserService);

  // SIGNALS
  searchTerm = signal<string>('');
  collections = signal<ICollection[]>([]);
  questions = signal<IQuestion[]>([]);
  loading = signal<boolean>(false);
  hasSearched = signal<boolean>(false);
  countQuestionsView = signal<number>(4);
  countCollectionsView = signal<number>(4);

  // COMPUTEDS
  user = computed<IUser>(() => this.loggedUserService.loggedUser());
  hasResults = computed(() => this.collections().length > 0 || this.questions().length > 0);

  search() {
    const term = this.searchTerm().trim();
    if (!term) return;

    this.loading.set(true);
    this.hasSearched.set(true);

    const searchData: IPublicSearch = {
      searchTerm: term,
      userId: this.user().id
    };

    forkJoin({
      collections: this.collectionsService.searchPublicCollections(searchData),
      questions: this.questionsService.searchPublicQuestions(searchData)
    }).subscribe({
      next: (results) => {
        this.collections.set(results.collections);
        this.questions.set(results.questions);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Erro na busca:', error);
        this.loading.set(false);
      }
    });
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.search();
    }
  }

  formatDate(dateIn: string | undefined): string {
    // if (!date) return '';
    // return new Date(date).toLocaleDateString('pt-BR');
    // const date = new Date(this.collection().date);

    const date = dateIn ? new Date(dateIn) : undefined;
    if (!date) return '';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 1) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours < 1) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return `há ${diffMinutes} minuto${diffMinutes !== 1 ? 's' : ''}`;
      }
      return `há ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
    } else if (diffDays < 7) {
      return `há ${diffDays} dia${diffDays !== 1 ? 's' : ''}`;
    } else {
      const diffWeeks = Math.floor(diffDays / 7);
      return `há ${diffWeeks} semana${diffWeeks !== 1 ? 's' : ''}`;
    }
  }

  likeCollection(collectionId: string | undefined) {
    if (!collectionId) return;

    const likeData: ILikeCollection = {
      collection_id: collectionId,
      user_id: this.user().id
    };

    this.collectionsService.like(likeData).subscribe({
      next: () => {
        // Atualizar o estado local
        this.collections.update(collections =>
          collections.map(c =>
            c.id === collectionId ? { ...c, is_liked: !c.is_liked } : c
          )
        );
      },
      error: (error) => {
        console.error('Erro ao curtir coleção:', error);
      }
    });
  }

  likeQuestion(questionId: string | undefined) {
    if (!questionId) return;

    const likeData: ILikeQuestion = {
      question_id: questionId,
      user_id: this.user().id
    };

    this.questionsService.like(likeData).subscribe({
      next: () => {
        // Atualizar o estado local
        this.questions.update(questions =>
          questions.map(q =>
            q.id === questionId ? { ...q, is_liked: !q.is_liked } : q
          )
        );
      },
      error: (error) => {
        console.error('Erro ao curtir questão:', error);
      }
    });
  }

  showMoreQuestions(){
    this.countQuestionsView.update(count => count + 5);
  }

  showMoreCollections(){
    this.countCollectionsView.update(count => count + 5);
  }
}
