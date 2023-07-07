import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-question-extractor',
  templateUrl: './question-extractor.component.html',
  styleUrls: ['./question-extractor.component.scss'],
})
export class QuestionExtractorComponent {
  textInput: string = '';
  formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    textInput: [this.textInput],
  });

  constructor(private router: Router, private authService: AuthService) {}

  extractQuestions(): void {
    if (!this.form.value.textInput) {
      return;
    }
    const lines = this.form.value.textInput.split('\n');
    let questions = [];
    let currentQuestion = [];

    for (let line of lines) {
      line = line.trim();

      if (line !== '') {
        currentQuestion.push(line);
      } else {
        if (currentQuestion.length > 0) {
          questions.push(currentQuestion);
          currentQuestion = [];
        }
      }
    }

    if (currentQuestion.length > 0) {
      questions.push(currentQuestion);
    }

    console.log('Extracted Questions:', questions);
  }
}
