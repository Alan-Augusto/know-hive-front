import { Component, inject, signal } from '@angular/core';
import { QuestionResponseService } from '../../../services/question-response/question-response.service';
import { ICollectionStats } from '../../../entity/questionResponse.interface';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'collection-statistics',
  imports: [],
  templateUrl: './collection-statistics.component.html',
  styleUrl: './collection-statistics.component.scss'
})
export class CollectionStatisticsComponent {

  private questionResponseService = inject(QuestionResponseService);
  private dynamicDialogConfig = inject(DynamicDialogConfig);

  data = signal<ICollectionStats|null>(null);

  ngOnInit() {
    const data = this.dynamicDialogConfig.data;
    if (data?.collectionId) {
      this.loadStats(data.collectionId);
    }
  }

  loadStats(id:string){
    this.questionResponseService.getCollectionStats(id).subscribe({
      next: (stats) => {
        this.data.set(stats);
        console.log('Collection stats loaded:', stats);
      },
      error: (err) => {
        console.error('Error loading collection stats:', err);
      }
    });
  }

}
