import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { IQuestion, ITest } from 'src/app/services/tests.service';
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

  saveTest() {
    const test = this.form.value;
    // console.log(test);
    // const questions: IQuestion = {
    //   answers: this.form.value.questions}
    const questions: IQuestion[] = this.form.value.questions.map(
      (element: any, index: number) => {
        return {
          id: index,
          questionText: element.questionText,
          type: element.multipleChoice ? 'mc' : 'radio',
          answers: element.answers.map((answer: any, id: number) => ({
            id: id,
            ...answer,
          })),
          correctAnswers: [1],
        };
      }
    );
    // console.log(questions);
    let myTest: ITest = {
      ownerId: 1,
      title: this.form.value.title,
      questions: questions,
      visibility: 'public',
    };
    console.log(myTest);
    //  save the test ...

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
