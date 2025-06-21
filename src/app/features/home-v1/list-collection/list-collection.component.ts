import { Component, inject } from '@angular/core';
import { BaseListComponent } from '../../../components/base/base-list/base-list.component';
import { CollectionsService } from '../../../services/collections/collections.service';

@Component({
  selector: 'list-collection',
  imports: [],
  templateUrl: './list-collection.component.html',
  styleUrl: './list-collection.component.scss'
})
export class ListCollectionComponent extends BaseListComponent {

  private readonly collectionService = inject(CollectionsService);

  ngOnInit() {
    this.loadData(() => this.collectionService.findAllForUser(this.user().id));
  }

}
