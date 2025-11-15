import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

const API_URL = 'http://localhost:8080/api';


export type Perfil = 'ADMIN' | 'OPERADOR';

export interface UsuarioResponse {
  id: number;
  nomeCompleto: string;
  email: string;
  perfil: Perfil;
  ativo: boolean;
}

export interface UsuarioRequest {
  nomeCompleto: string;
  email: string;
  senha?: string;
  perfil: Perfil;
  ativo: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  public listarUsuarios(): Observable<UsuarioResponse[]> {
    return this.http.get<UsuarioResponse[]>(`${API_URL}/usuarios`, {
      headers: this.getAuthHeaders()
    });
  }

  public criarUsuario(dto: UsuarioRequest): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(`${API_URL}/usuarios`, dto, {
      headers: this.getAuthHeaders()
    });
  }

  public atualizarUsuario(id: number, dto: UsuarioRequest): Observable<UsuarioResponse> {
    return this.http.put<UsuarioResponse>(`${API_URL}/usuarios/${id}`, dto, {
      headers: this.getAuthHeaders()
    });
  }

  public deletarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/usuarios/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}