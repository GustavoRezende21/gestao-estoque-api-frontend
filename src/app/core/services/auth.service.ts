import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { LoginResponse } from './interfaces/auth.interfaces';

const API_URL = 'http://localhost:8080/api';

const TOKEN_KEY = 'auth-token';
const USER_NAME_KEY = 'auth-username';
const USER_ROLE_KEY = 'auth-userrole';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = API_URL;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(email: string, senha: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, senha })
      .pipe(
        tap(response => {
          this.salvarSessao(response);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_NAME_KEY);
    localStorage.removeItem(USER_ROLE_KEY);
    
    this.router.navigate(['/login']);
  }

  private salvarSessao(response: LoginResponse): void {
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_NAME_KEY, response.nomeUsuario);
    localStorage.setItem(USER_ROLE_KEY, response.perfilUsuario);
  }

  public getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  public isLoggedIn(): boolean {
    return !!this.getToken();
  }

  public getNomeUsuario(): string | null {
    return localStorage.getItem(USER_NAME_KEY);
  }

  public getPerfilUsuario(): string | null {
    return localStorage.getItem(USER_ROLE_KEY);
  }
}