import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

const API_URL = 'http://localhost:8080/api';

export interface ItemVendaRequest {
  produtoId: number;
  quantidade: number;
}

export interface VendaRequest {
  valorRecebido: number;
  itens: ItemVendaRequest[];
}

@Injectable({
  providedIn: 'root'
})
export class VendaService {

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

  public registrarVenda(dto: VendaRequest): Observable<any> {
    return this.http.post<any>(`${API_URL}/vendas`, dto, {
      headers: this.getAuthHeaders()
    });
  }
}