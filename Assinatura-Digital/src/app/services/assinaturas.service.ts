import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Assinatura } from '../models/Assinatura.model';
import { Cliente } from '../models/Cliente.model';
import { Termo } from '../models/Termo.model';

@Injectable({
  providedIn: 'root'
})
export class AssinaturasService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  // ============================================
  // MÉTODOS PRIVADOS - Auxiliares
  // ============================================
  
  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('auth-token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // ============================================
  // MÉTODOS PÚBLICOS - SEM AUTENTICAÇÃO
  // ============================================

  /**
   * Buscar assinatura pública (para página de assinatura do cliente)
   * Retorna a assinatura com todas as informações necessárias
   */
  buscarAssinaturaPublica(id: string): Observable<Assinatura> {
    return this.http.get<Assinatura>(`${this.baseUrl}/Assinaturas/${id}/publica`);
  }

  /**
   * Marcar assinatura como assinada (cliente não tem login)
   */
  marcarComoAssinada(id: string, payload: { ipAssinatura: string; localizacao: string; }): Observable<Assinatura> {
return this.http.post<Assinatura>(`${this.baseUrl}/Assinaturas/${id}/assinar`, payload);
  }

  /**
   * Obter PDF da assinatura (público)
   */
  obterPdfAssinatura(id: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/Assinaturas/${id}/pdf`, {
      responseType: 'blob'
    });
  }

  // ============================================
  // MÉTODOS PROTEGIDOS - COM AUTENTICAÇÃO
  // ============================================

  /**
   * Criar assinatura com PDF (corretor logado)
   */
  criarAssinaturaComPdf(
    clienteId: string,
    termoId: string,
    cenarioId: string,
    pdfFile: File
  ): Observable<Assinatura> {
    const formData = new FormData();
    formData.append('clienteId', clienteId);
    formData.append('termoId', termoId);
    formData.append('cenarioId', cenarioId);
    formData.append('pdf', pdfFile);

    return this.http.post<Assinatura>(`${this.baseUrl}/Assinaturas`, formData, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Listar todas as assinaturas (corretor logado)
   */
  listarAssinaturas(): Observable<Assinatura[]> {
    return this.http.get<Assinatura[]>(`${this.baseUrl}/Assinaturas`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Buscar assinatura por ID (corretor logado)
   */
  buscarAssinaturaPorId(id: string): Observable<Assinatura> {
    return this.http.get<Assinatura>(`${this.baseUrl}/Assinaturas/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Buscar cliente por ID (corretor logado)
   */
  buscarCliente(id: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.baseUrl}/clientes/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Buscar termo por ID (corretor logado)
   */
  buscarTermo(id: string): Observable<Termo> {
    return this.http.get<Termo>(`${this.baseUrl}/termos/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Gerar link de assinatura (corretor logado)
   */
  gerarLink(id: string): Observable<Assinatura> {
    return this.http.post<Assinatura>(`${this.baseUrl}/Assinaturas/${id}/gerar-link`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Buscar assinaturas por status (corretor logado)
   */
  buscarPorStatus(status: string): Observable<Assinatura[]> {
    return this.http.get<Assinatura[]>(`${this.baseUrl}/Assinaturas/status/${status}`, {
      headers: this.getAuthHeaders()
    });
  }

  // ============================================
  // MÉTODOS UTILITÁRIOS
  // ============================================

  /**
   * Verificar se usuário está autenticado
   */
  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('auth-token');
  }

}