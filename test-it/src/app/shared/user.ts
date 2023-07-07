export interface User {
  _id?: number;
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  password: string;
}

export interface LoginUser {
  email: string;
  password: string;
}
