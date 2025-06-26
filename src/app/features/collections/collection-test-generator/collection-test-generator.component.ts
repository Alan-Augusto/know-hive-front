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

  generatePdf() {
    // Criar uma nova janela para impressão
    const printWindow = window.open('', '_blank');

    if (!printWindow) {
      this.notificationService.toastError('Por favor, permita pop-ups para gerar o PDF.');
      return;
    }

    // Obter o HTML das páginas do teste
    const testPagesElement = document.querySelector('.test-pages');
    if (!testPagesElement) {
      this.notificationService.toastError('Erro ao obter o conteúdo do teste.');
      printWindow.close();
      return;
    }

    // CSS específico para impressão
    const printStyles = `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Times New Roman', Times, serif;
          margin: 0;
          padding: 0;
          background: white;
          color: #000;
          font-size: 12pt;
          line-height: 1.4;
        }

        @page {
          size: A4;
          margin: 0;
        }

        .test-pages {
          display: block;
        }

        .a4-paper {
          width: 210mm;
          height: 297mm;
          background: white;
          page-break-after: always;
          page-break-inside: avoid;
          padding: 15mm 20mm 20mm 20mm;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        }

        .a4-paper:last-child {
          page-break-after: auto;
        }

        .test-header {
          margin-bottom: 20px;
        }

        .test-title {
          font-size: 16pt;
          font-weight: bold;
          margin: 20px 0 25px 0;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 1px;
          border: 2px solid #000;
          padding: 10px;
          background-color: #f8f9fa;
        }

        .test-info {
          margin-bottom: 20px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px 20px;
          align-items: center;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .info-item.full-width {
          grid-column: 1 / -1;
        }

        .label {
          font-weight: bold;
          font-size: 11pt;
          white-space: nowrap;
        }

        .underline-long {
          flex: 1;
          border-bottom: 1px solid #000;
          height: 18px;
          min-width: 250px;
        }

        .underline-medium {
          flex: 1;
          border-bottom: 1px solid #000;
          height: 18px;
          min-width: 120px;
        }

        .underline-short {
          flex: 1;
          border-bottom: 1px solid #000;
          height: 18px;
          min-width: 60px;
        }

        .test-description {
          background-color: #f8f9fa;
          padding: 12px;
          border: 1px solid #dee2e6;
          margin-bottom: 20px;
          border-radius: 4px;
        }

        .test-description p {
          margin: 0;
          font-style: italic;
          font-size: 11pt;
          text-align: justify;
        }

        .test-instructions {
          margin-bottom: 25px;
          padding: 12px;
          border: 2px solid #000;
          background-color: #fff;
        }

        .test-instructions h3 {
          margin: 0 0 10px 0;
          font-size: 12pt;
          font-weight: bold;
          text-align: center;
        }

        .test-instructions ul {
          margin: 0;
          padding-left: 18px;
        }

        .test-instructions li {
          font-size: 10pt;
          margin-bottom: 4px;
          line-height: 1.3;
        }

        .question-item {
          margin-bottom: 20px;
          page-break-inside: avoid;
        }

        .question-header {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-bottom: 8px;
        }

        .question-number {
          font-weight: bold;
          font-size: 12pt;
          min-width: 25px;
        }

        .question-title {
          font-weight: bold;
          font-size: 11pt;
          color: #495057;
          font-style: italic;
        }

        .question-statement {
          margin-left: 25px;
          margin-bottom: 12px;
          font-size: 11pt;
          line-height: 1.4;
          text-align: justify;
          font-weight: 500;
        }

        .alternatives-section {
          margin-left: 30px;
          page-break-inside: avoid;
        }

        .alternative-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-bottom: 8px;
          padding: 3px 0;
        }

        .alternative-mark {
          display: flex;
          align-items: center;
          gap: 5px;
          min-width: 50px;
        }

        .alternative-letter {
          font-weight: bold;
          font-size: 11pt;
        }

        .mark-circle {
          font-weight: bold;
          font-size: 12pt;
        }

        .alternative-text {
          font-size: 11pt;
          line-height: 1.3;
          flex: 1;
          text-align: justify;
        }

        .true-false-section {
          margin-left: 30px;
          margin-top: 8px;
          page-break-inside: avoid;
        }

        .true-false-item {
          margin-bottom: 10px;
        }

        .statement-with-answer {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 3px 0;
        }

        .answer-box {
          font-weight: bold;
          font-size: 12pt;
          min-width: 35px;
          flex-shrink: 0;
        }

        .statement-text {
          font-size: 11pt;
          line-height: 1.3;
          flex: 1;
          text-align: justify;
        }

        .single-true-false .answer-instruction {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 8px;
        }

        .instruction-text {
          font-size: 10pt;
          color: #6c757d;
          font-style: italic;
        }

        .essay-section {
          margin-left: 30px;
          margin-top: 12px;
          page-break-inside: avoid;
        }

        .answer-line {
          border-bottom: 1px solid #000;
          height: 20px;
          margin-bottom: 6px;
          width: 100%;
        }

        .page-footer {
          position: absolute;
          bottom: 15mm;
          left: 20mm;
          right: 20mm;
          border-top: 1px solid #000;
          padding-top: 8px;
        }

        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 10pt;
          color: #000;
        }

        .page-number {
          font-weight: bold;
        }

        .question-count {
          font-style: italic;
        }

        @media print {
          body {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }

          .a4-paper {
            page-break-after: always;
          }

          .a4-paper:last-child {
            page-break-after: auto;
          }
        }
      </style>
    `;

    // Criar o documento HTML completo
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Prova - ${this.collection()?.title || 'Teste'}</title>
          ${printStyles}
        </head>
        <body>
          <div class="test-pages">
            ${testPagesElement.innerHTML}
          </div>
        </body>
      </html>
    `;

    // Escrever o conteúdo na nova janela
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Aguardar o carregamento e imprimir
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        // Fechar a janela após a impressão (opcional)
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      }, 500);
    };

    this.notificationService.toastSuccess('Preparando PDF para impressão...');
  }

  cancel() {
    this.dynamicDialogRef.close();
  }
}
