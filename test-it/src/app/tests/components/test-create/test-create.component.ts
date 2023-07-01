import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-test-create',
  templateUrl: './test-create.component.html',
  styleUrls: ['./test-create.component.scss'],
})
export class TestCreateComponent {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      testTitle: '',
      questions: this.formBuilder.array([this.createQuestionGroup()]),
    });
  }

  createQuestionGroup() {
    return this.formBuilder.group({
      text: '',
      multipleChoice: false,
      answers: this.formBuilder.array([
        this.createAnswerGroup(),
        this.createAnswerGroup(),
        this.createAnswerGroup(),
        this.createAnswerGroup(),
      ]),
    });
  }

  createAnswerGroup() {
    return this.formBuilder.group({
      text: '',
      correct: false,
    });
  }

  get questionGroups() {
    return this.form.get('questions') as FormArray;
  }

  answerGroups(index: number) {
    return this.questionGroups.controls[index].get('answers') as FormArray;
  }

  addQuestion() {
    this.questionGroups.push(this.createQuestionGroup());
  }

  addAnswer(questionIndex: number) {
    this.answerGroups(questionIndex).push(this.createAnswerGroup());
  }

  saveTest() {
    const test = this.form.value;
    console.log(test);
    //  save the test ...

    this.form.reset({
      testTitle: '',
      questions: [this.createQuestionGroup()],
    });
  }
}
