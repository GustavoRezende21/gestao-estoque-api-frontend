import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

const API_URL = 'http://localhost:8080/api';


export interface ProdutoResponse {
  id: number;
  nome: string;
  categoria: string;
  precoUnitario: number;
  quantidadeEmEstoque: number;
}

export interface ProdutoRequest {
  nome: string;
  categoria: string;
  precoUnitario: number;
  quantidadeEmEstoque: number;
}


@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

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

  public listarProdutos(): Observable<ProdutoResponse[]> {
    return this.http.get<ProdutoResponse[]>(`${API_URL}/produtos`, {
      headers: this.getAuthHeaders()
    });
  }

  public criarProduto(dto: ProdutoRequest): Observable<ProdutoResponse> {
    return this.http.post<ProdutoResponse>(`${API_URL}/produtos`, dto, {
      headers: this.getAuthHeaders()
    });
  }

  public atualizarProduto(id: number, dto: ProdutoRequest): Observable<ProdutoResponse> {
    return this.http.put<ProdutoResponse>(`${API_URL}/produtos/${id}`, dto, {
      headers: this.getAuthHeaders()
    });
  }

  public deletarProduto(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/produtos/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}