import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

const API_URL = 'http://localhost:8080/api';

export interface RelatorioFiltros {
  dataInicial?: string;
  dataFinal?: string;
  valorMinimo?: number;
  valorMaximo?: number;
  usuarioId?: number;
}

export interface RelatorioResponse {
  totalVendas: number;
  totalItensVendidos: number;
  vendasFiltradas: any[];
}

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {

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

  public gerarRelatorio(filtros: RelatorioFiltros): Observable<RelatorioResponse> {

    let params = new HttpParams();
    if (filtros.dataInicial) {
      params = params.append('dataInicial', filtros.dataInicial);
    }
    if (filtros.dataFinal) {
      params = params.append('dataFinal', filtros.dataFinal);
    }
    if (filtros.valorMinimo) {
      params = params.append('valorMinimo', filtros.valorMinimo);
    }
    if (filtros.valorMaximo) {
      params = params.append('valorMaximo', filtros.valorMaximo);
    }
    if (filtros.usuarioId) {
      params = params.append('usuarioId', filtros.usuarioId);
    }

    return this.http.get<RelatorioResponse>(`${API_URL}/relatorios`, {
      headers: this.getAuthHeaders(),
      params: params
    });
  }
}