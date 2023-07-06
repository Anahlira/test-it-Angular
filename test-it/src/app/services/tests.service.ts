import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { RestApiService } from '../shared/rest-api.service';

export interface IAnswer {
  id: number;
  text: string;
}
export interface IQuestion {
  id: number;
  questionText: string;
  type: 'radio' | 'mc';
  answers: IAnswer[];
  correctAnswers: number[] | number;
}

export interface ITest {
  _id?: string;
  ownerId?: number;
  title: string;
  questions: IQuestion[];
  visibility: 'public' | 'private';
}

@Injectable({
  providedIn: 'root',
})
export class TestsService {
  tests$: Observable<ITest[]> = new BehaviorSubject<ITest[]>([]);

  constructor(private http: HttpClient, private restApi: RestApiService) {
    this.tests$ = this.loadTests();
  }

  loadTests(): Observable<ITest[]> {
    return this.restApi.getTests();
  }

  getTest(id: string): Observable<ITest> {
    return this.restApi.getTestById(id);
  }

  updateTest(id: number | undefined, user: ITest): void {
    this.tests$ = this.tests$.pipe(
      map((tests: ITest[]) => {
        const index = tests.findIndex((u) => u._id === id);
        if (index !== -1) {
          tests[index] = user;
        }
        return tests;
      })
    );
  }

  deleteTest(id: string): void {
    this.restApi.deleteTestById(id).subscribe(() => {
      this.tests$ = this.loadTests();
    });
    //not reloading list?
    // this.tests$ = this.loadTests();
  }
}

// const tests: ITest[] = [
//   {
//     id: 1,
//     ownerId: 123,
//     title: 'Test 1',
//     questions: [
//       {
//         id: 1,
//         questionText: 'Q1',
//         type: 'radio',
//         answers: [
//           { id: 1, text: 'Option A' },
//           { id: 2, text: 'Option B' },
//           { id: 3, text: 'Option C' },
//         ],
//         correctAnswers: [1],
//       },
//       {
//         id: 2,
//         questionText: 'Q2',
//         type: 'mc',
//         answers: [
//           { id: 1, text: 'Option A' },
//           { id: 2, text: 'Option B' },
//           { id: 3, text: 'Option C' },
//         ],
//         correctAnswers: [1],
//       },
//     ],
//     visibility: 'public',
//   },
//   {
//     id: 2,
//     ownerId: 456,
//     title: 'Test 2',
//     questions: [
//       {
//         id: 1,
//         questionText: 'Q1',
//         type: 'radio',
//         answers: [
//           { id: 1, text: 'Option X' },
//           { id: 2, text: 'Option Y' },
//           { id: 3, text: 'Option Z' },
//         ],
//         correctAnswers: [1],
//       },
//     ],
//     visibility: 'private',
//   },
// ];
