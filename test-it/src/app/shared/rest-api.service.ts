import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginUser, User } from './user';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { ITest } from '../services/tests.service';
@Injectable({
  providedIn: 'root',
})
export class RestApiService {
  // Define API
  apiURL = 'http://localhost:3000';
  constructor(private http: HttpClient) {}
  /*========================================
    CRUD Methods for consuming RESTful API
  =========================================*/
  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    withCredentials: true,
  };

  // HttpClient API post() method => Create User
  createUser(User: User): Observable<User> {
    return this.http
      .post<User>(
        this.apiURL + '/auth/register',
        JSON.stringify(User),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  loginUser(User: LoginUser): Observable<User> {
    return this.http
      .post<User>(
        this.apiURL + '/auth/login',
        JSON.stringify({ email: User.email, password: User.password }),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  logoutUser(): Observable<boolean> {
    console.log('loggging out');
    //not calling this???

    return this.http
      .post<boolean>(this.apiURL + '/auth/logout', {}, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  createTest(test: ITest): Observable<ITest> {
    return this.http
      .post<ITest>(this.apiURL + '/tests', test, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  getTests(): Observable<ITest[]> {
    return this.http
      .get<ITest[]>(this.apiURL + '/tests', this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  getCustomerTests(customerId: number): Observable<ITest[]> {
    return this.http
      .get<ITest[]>(this.apiURL + `/tests/user/${customerId}`, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  getTestById(id: string): Observable<ITest> {
    return this.http
      .get<ITest>(this.apiURL + `/tests/${id}`, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  deleteTestById(id: string): Observable<ITest> {
    return this.http
      .delete<ITest>(this.apiURL + `/tests/${id}`, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  updateTestById(id: string, body: ITest): Observable<ITest> {
    return this.http
      .patch<ITest>(this.apiURL + `/tests/${id}`, body, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  // Error handling
  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
