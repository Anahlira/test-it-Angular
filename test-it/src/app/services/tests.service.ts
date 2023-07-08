import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { RestApiService } from '../shared/rest-api.service';
import { AuthService } from './auth.service';

export interface IAnswer {
  id: number;
  text: string;
  correct?: boolean;
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
  customerTests$: Observable<ITest[]> = new BehaviorSubject<ITest[]>([]);
  createdTest$: Observable<ITest> = new BehaviorSubject<ITest>({} as ITest);

  constructor(
    private http: HttpClient,
    private restApi: RestApiService,
    private authServise: AuthService
  ) {
    this.reLoad();
  }

  reLoad(): void {
    this.tests$ = this.loadTests();
    this.customerTests$ = this.loadCustomerTests();
  }

  loadTests(): Observable<ITest[]> {
    return this.restApi.getTests();
  }

  loadCustomerTests(): Observable<ITest[]> {
    return this.authServise?.user?._id
      ? this.restApi.getCustomerTests(this.authServise.user._id)
      : of([]);
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

  editTest(id: string, body: ITest): Observable<ITest> {
    return this.restApi.updateTestById(id, body);
  }

  deleteTest(id: string): void {
    this.restApi.deleteTestById(id).subscribe(() => {
      this.reLoad();
    });
  }

  saveCreatedTest(test: ITest): void {
    this.createdTest$ = new BehaviorSubject<ITest>(test);
  }

  resetCreatedTest(): void {
    this.createdTest$ = new BehaviorSubject<ITest>({} as ITest);
  }
}
