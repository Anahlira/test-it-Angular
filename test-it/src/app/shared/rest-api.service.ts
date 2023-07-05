import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginUser, User } from '../shared/user';
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
  };

  // HttpClient API post() method => Create User
  createUser(User: User): Observable<User> {
    return this.http
      .post<User>(
        this.apiURL + '/Users',
        JSON.stringify({ User }),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  loginUser(User: LoginUser): Observable<User> {
    return this.http
      .post<User>(
        // this.apiURL + '/Users',
        'https://dummyjson.com/auth/login',
        JSON.stringify({ username: User.email, password: User.password }),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  createTest(test: ITest): Observable<ITest> {
    return this.http
      .post<ITest>(
        // this.apiURL + '/Users',
        'http://localhost:3000/tests',
        test,
        this.httpOptions
      )
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
