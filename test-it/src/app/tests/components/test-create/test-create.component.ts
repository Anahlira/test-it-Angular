import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { IAnswer, IQuestion, ITest } from 'src/app/services/tests.service';
import { RestApiService } from 'src/app/shared/rest-api.service';

@Component({
  selector: 'app-test-create',
  templateUrl: './test-create.component.html',
  styleUrls: ['./test-create.component.scss'],
})
export class TestCreateComponent {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public restApi: RestApiService
  ) {
    this.form = this.formBuilder.group({
      title: '',
      private: false,
      questions: this.formBuilder.array([this.createQuestionGroup()]),
    });
  }

  createQuestionGroup() {
    return this.formBuilder.group({
      questionText: '',
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

  removeAnswer(questionIndex: number, answerIndex: number) {
    this.answerGroups(questionIndex).removeAt(answerIndex);
  }

  updateCorrectAnswer(question: any, selectedAnswerIndex: number) {
    const answerGroups = question.get('answers') as FormArray;
    answerGroups.controls.forEach((answerGroup: any, index: number) => {
      answerGroup.get('correct').setValue(index === selectedAnswerIndex);
    });
  }

  saveTest() {
    const questions: IQuestion[] = this.form.value.questions.map(
      (element: any, index: number) => {
        // Filter the empty answers
        const answers = element.answers
          .filter((el: IAnswer) => el.text !== '')
          .map((answer: any, id: number) => ({
            id: id + 1,
            ...answer,
          }));

        return {
          id: index + 1,
          questionText: element.questionText,
          type: element.multipleChoice ? 'mc' : 'radio',
          answers: answers,
          correctAnswers: [1],
        };
      }
    );

    const myTest: ITest = {
      ownerId: 1,
      title: this.form.value.title,
      questions: questions,
      visibility: 'public',
    };
    console.log(myTest);

    this.restApi.createTest(myTest).subscribe((data: ITest) => {
      console.log(data);
    });

    this.form.reset({
      testTitle: '',
      private: false,
      questions: [this.createQuestionGroup()],
    });
  }
}
