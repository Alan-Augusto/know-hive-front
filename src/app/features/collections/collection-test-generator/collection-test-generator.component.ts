import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ICollection } from '../../../entity/collection.interface';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CollectionsService } from '../../../services/collections/collections.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { CommonModule } from '@angular/common';
import { KhButtonComponent } from '../../../components/kh-button/kh-button.component';

interface QuestionPage {
  pageNumber: number;
  questions: any[];
  isFirstPage: boolean;
}

@Component({
  selector: 'collection-test-generator',
  imports: [CommonModule, KhButtonComponent],
  templateUrl: './collection-test-generator.component.html',
  styleUrl: './collection-test-generator.component.scss'
})
export class CollectionTestGeneratorComponent implements OnInit {

  private dynamicDialogRef = inject(DynamicDialogRef);
  private dynamicDialogConfig = inject(DynamicDialogConfig);
  private collectionsService = inject(CollectionsService);
  private notificationService = inject(NotificationService);

  collection = signal<ICollection | null>(null);
  isLoading = signal<boolean>(false);
  questionPages = signal<QuestionPage[]>([]);

  // Computed para verificar se há múltiplas páginas
  hasMultiplePages = computed(() => this.questionPages().length > 1);

  ngOnInit() {
    this.loadCollection();
  }

  // Método para obter as letras das alternativas
  getAlternativeLetter(index: number): string {
    return String.fromCharCode(97 + index); // a, b, c, d, etc.
  }

  // Método para calcular a altura estimada de uma questão em mm
  private calculateQuestionHeight(question: any): number {
    let height = 0;

    // Altura do cabeçalho da questão (número + título)
    height += 10; // mm - aumentado para dar mais espaço

    // Altura do enunciado (estimativa baseada no número de caracteres)
    const statementLines = Math.ceil(question.statement.length / 70); // ~70 chars por linha (mais conservador)
    height += statementLines * 5; // 5mm por linha

    // Altura baseada no tipo de questão
    if (question.type_id === 1 && question.alternatives) {
      // Múltipla escolha - cada alternativa ~7mm (aumentado)
      height += question.alternatives.length * 7;
    } else if (question.type_id === 2) {
      // Verdadeiro ou falso
      if (question.alternatives) {
        height += question.alternatives.length * 7;
      } else {
        height += 12; // espaço para resposta V/F
      }
    } else {
      // Dissertativa - 6 linhas de resposta
      height += 6 * 7; // 7mm por linha (aumentado)
    }

    // Margem entre questões (aumentada para garantir separação visual)
    height += 12;

    return height;
  }

  // Método para dividir questões em páginas
  private divideQuestionsIntoPages() {
    const questions = this.collection()?.questions || [];
    if (questions.length === 0) {
      this.questionPages.set([]);
      return;
    }

    const pages: QuestionPage[] = [];
    let currentPage: QuestionPage = {
      pageNumber: 1,
      questions: [],
      isFirstPage: true
    };

    // Altura disponível na primeira página (considerando cabeçalho e instruções)
    const firstPageAvailableHeight = 130; // mm (reduzido para ser mais conservador)
    // Altura disponível nas páginas subsequentes
    const nextPagesAvailableHeight = 200; // mm (reduzido para ser mais conservador)

    let currentPageHeight = 0;
    const maxHeightForCurrentPage = currentPage.isFirstPage ? firstPageAvailableHeight : nextPagesAvailableHeight;

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const questionHeight = this.calculateQuestionHeight(question);
      const availableHeight = currentPage.isFirstPage ? firstPageAvailableHeight : nextPagesAvailableHeight;

      // Verifica se a questão cabe na página atual
      // IMPORTANTE: Se a página já tem questões E a nova questão não cabe, pula para próxima página
      if (currentPage.questions.length === 0 || currentPageHeight + questionHeight <= availableHeight) {
        // Adiciona a questão na página atual
        currentPage.questions.push(question);
        currentPageHeight += questionHeight;
      } else {
        // A questão não cabe na página atual - cria uma nova página
        pages.push(currentPage);

        currentPage = {
          pageNumber: pages.length + 1,
          questions: [question],
          isFirstPage: false
        };
        currentPageHeight = questionHeight;
      }
    }

    // Adiciona a última página se houver questões
    if (currentPage.questions.length > 0) {
      pages.push(currentPage);
    }

    this.questionPages.set(pages);
  }

  // Método para obter o número da questão baseado na posição original
  getQuestionNumber(question: any): number {
    const allQuestions = this.collection()?.questions || [];
    return allQuestions.findIndex(q => q.id === question.id) + 1;
  }

  private loadCollection() {
    const data = this.dynamicDialogConfig.data;
    if (data?.collectionId) {
      this.isLoading.set(true);
      this.collectionsService.findOne(data.collectionId).subscribe({
        next: (collection: any) => {
          this.collection.set(collection as ICollection);
          this.divideQuestionsIntoPages();
          this.isLoading.set(false);
          console.log('Collection loaded:', this.collection());
          console.log('Question pages:', this.questionPages());
        },
        error: (error) => {
          console.error('Error loading collection:', error);
          this.isLoading.set(false);
          this.dynamicDialogRef.close();
        }
      });
    } else {
      this.notificationService.toastError('Erro ao carregar a coleção.');
      this.dynamicDialogRef.close();
    }
  }
}
