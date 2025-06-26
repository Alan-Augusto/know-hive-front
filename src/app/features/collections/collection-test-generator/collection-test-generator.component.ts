import { Component, inject, signal } from '@angular/core';
import { ICollection } from '../../../entity/collection.interface';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CollectionsService } from '../../../services/collections/collections.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'collection-test-generator',
  imports: [CommonModule],
  templateUrl: './collection-test-generator.component.html',
  styleUrl: './collection-test-generator.component.scss'
})
export class CollectionTestGeneratorComponent {

  private dynamicDialogRef = inject(DynamicDialogRef);
  private dynamicDialogConfig = inject(DynamicDialogConfig);
  private collectionsService = inject(CollectionsService);
  private notificationService = inject(NotificationService);


  collection = signal<ICollection | null>(null);
  isLoading = signal<boolean>(false);

  ngOnInit() {
    this.loadCollection();
  }

  // Método para obter as letras das alternativas
  getAlternativeLetter(index: number): string {
    return String.fromCharCode(97 + index); // a, b, c, d, etc.
  }

  private loadCollection() {
    const data = this.dynamicDialogConfig.data;
    if (data?.collectionId) {
      this.isLoading.set(true);
      this.collectionsService.findOne(data.collectionId).subscribe({
        next: (collection: any) => {
          this.collection.set(collection as ICollection);
          this.isLoading.set(false);
          console.log('Collection loaded:', this.collection());
        },
        error: (error) => {
          console.error('Error loading collection:', error);
          this.isLoading.set(false);
          this.dynamicDialogRef.close();
        }
      });
    }
    else{
      this.notificationService.toastError('Erro ao carregar a coleção.');
      this.dynamicDialogRef.close();
    }
  }

}
