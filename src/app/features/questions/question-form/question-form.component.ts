import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';

@Component({
  selector: 'question-form',
  imports: [FormsModule],
  templateUrl: './question-form.component.html',
  styleUrl: './question-form.component.scss'
})
export class QuestionFormComponent {

  private fb = inject(FormBuilder);

  formGroup = this.fb.group({
    id: [null, []],
    statement: [null, []],
    type_id: [null, []],
    created_at: [null, []],
  });
}
