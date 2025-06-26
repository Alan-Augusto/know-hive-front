import { Component, inject, input, model, signal } from '@angular/core';
import { TagService } from '../../services/tag/tag.service';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'tags-input',
  imports: [AutoCompleteModule, FormsModule, ReactiveFormsModule],
  templateUrl: './tags-input.component.html',
  styleUrl: './tags-input.component.scss'
})
export class TagsInputComponent {


  private tagService = inject(TagService)
  private fb = inject(FormBuilder);

  formGroup = input.required<FormGroup>();
  formControlName = input.required<string>();

  existingTags = signal<string[]>([]);
  existingTagsWithQuery = signal<string[]>(this.existingTags());
  isLoading = signal<boolean>(false);

  ngOnInit() {
    this.loadTags();
  }

  loadTags() {
    this.tagService.findAll().subscribe({
      next: (tags) => {
        this.existingTags.set(tags.map((tag: any) => tag.name));
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading tags:', error);
        this.isLoading.set(false);
      }
    });
  }

  onSearch(event: AutoCompleteCompleteEvent) {
    if (!this.existingTags().includes(event.query)) {
      this.existingTagsWithQuery.update((currentTags: string[]) => [
        event.query,
        ...this.existingTags().filter(tag => tag.toLowerCase().includes(event.query.toLowerCase()))
      ]);
    }
  }

}
