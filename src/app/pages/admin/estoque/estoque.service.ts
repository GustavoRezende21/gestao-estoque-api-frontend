import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

const API_URL = 'http://localhost:8080/api';

export type TipoMovimentacao = 'ENTRADA' | 'AJUSTE';

export interface EstoqueRequest {
  produtoId: number;
  tipo: TipoMovimentacao;
  quantidade: number;
  motivo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EstoqueService {

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

  public listarHistorico(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/estoque/historico`, {
      headers: this.getAuthHeaders()
    });
  }

  public registrarMovimentacao(dto: EstoqueRequest): Observable<any> {
    return this.http.post<any>(`${API_URL}/estoque/movimentar`, dto, {
      headers: this.getAuthHeaders()
    });
  }
}