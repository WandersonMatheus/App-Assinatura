import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
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
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private getAuthHeadersForFormData(): HttpHeaders {
    const token = sessionStorage.getItem('auth-token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
      // Não definir Content-Type para FormData - o navegador define automaticamente
    });
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erro na requisição:', error);
    
    let errorMessage = 'Erro desconhecido';
    
    if (error.error instanceof ErrorEvent) {
      // Erro no lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro no lado do servidor
      switch (error.status) {
        case 400:
          errorMessage = 'Dados inválidos enviados. Verifique se cliente e termo existem.';
          break;
        case 401:
          errorMessage = 'Acesso não autorizado. Faça login novamente.';
          break;
        case 403:
          errorMessage = 'Acesso negado';
          break;
        case 404:
          errorMessage = 'Recurso não encontrado';
          break;
        case 500:
          errorMessage = 'Erro interno do servidor';
          break;
        default:
          errorMessage = `Erro ${error.status}: ${error.message}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }

  // ============================================
  // MÉTODOS PÚBLICOS - SEM AUTENTICAÇÃO
  // ============================================

  /**
   * Buscar assinatura pública (para página de assinatura do cliente)
   * Retorna a assinatura com todas as informações necessárias
   */
  buscarAssinaturaPublica(id: string): Observable<Assinatura> {
    return this.http.get<Assinatura>(`${this.baseUrl}/Assinaturas/${id}/publica`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * Marcar assinatura como assinada (cliente não tem login)
   */
  marcarComoAssinada(id: string, payload: { ipAssinatura: string; localizacao: string; }): Observable<Assinatura> {
    return this.http.post<Assinatura>(`${this.baseUrl}/Assinaturas/${id}/assinar`, payload, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Confirmar assinatura com dados completos (CPF + selfie)
   * Método alternativo que pode ser usado se o backend esperar mais dados
   */
  confirmarAssinatura(id: string, payload: {
    cpfInformado: string;
    selfieBase64: string;
    ipAssinatura: string;
    localizacao: string;
  }): Observable<Assinatura> {
    return this.http.post<Assinatura>(`${this.baseUrl}/Assinaturas/${id}/confirmar`, payload, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obter PDF da assinatura (público)
   */
  obterPdfAssinatura(id: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/Assinaturas/${id}/pdf`, {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/pdf'
      })
    }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // ============================================
  // MÉTODOS PROTEGIDOS - COM AUTENTICAÇÃO
  // ============================================

  /**
   * ✅ CORRIGIDO: Criar assinatura com PDF (corretor logado)
   */
  criarAssinaturaComPdf(
    clienteId: string,
    termoId: string,
    cenarioId: string | null,
    pdfFile: File
  ): Observable<Assinatura> {
    console.log('=== SERVICE DEBUG ===');
    console.log('clienteId:', clienteId);
    console.log('termoId:', termoId);
    console.log('cenarioId:', cenarioId);
    console.log('pdfFile:', pdfFile?.name);

    const formData = new FormData();
    formData.append('clienteId', clienteId);
    formData.append('termoId', termoId);
    
    // ✅ CORREÇÃO: Só adicionar cenarioId se não for null/undefined/vazio
    if (cenarioId && cenarioId.trim() !== '') {
      formData.append('cenarioId', cenarioId.trim());
    }
    
    formData.append('pdf', pdfFile);

    // ✅ USAR HEADERS CORRETOS PARA FORM DATA
    const headers = this.getAuthHeadersForFormData();

    return this.http.post<Assinatura>(`${this.baseUrl}/Assinaturas`, formData, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Listar todas as assinaturas (corretor logado)
   */
  listarAssinaturas(): Observable<Assinatura[]> {
    const headers = this.getAuthHeaders();
    console.log('Token:', sessionStorage.getItem('auth-token')); // 🔍 Debug
    console.log('Headers:', headers); // 🔍 Debug
    
    return this.http.get<Assinatura[]>(`${this.baseUrl}/Assinaturas`, {
      headers: headers
    }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /**
   * Buscar assinatura por ID (corretor logado)
   */
  buscarAssinaturaPorId(id: string): Observable<Assinatura> {
    return this.http.get<Assinatura>(`${this.baseUrl}/Assinaturas/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /**
   * Buscar cliente por ID (corretor logado)
   */
  buscarCliente(id: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.baseUrl}/clientes/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /**
   * Buscar termo por ID (corretor logado)
   */
  buscarTermo(id: string): Observable<Termo> {
    return this.http.get<Termo>(`${this.baseUrl}/termos/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  /**
   * Gerar link de assinatura (corretor logado)
   */
  gerarLink(id: string): Observable<Assinatura> {
    return this.http.post<Assinatura>(`${this.baseUrl}/Assinaturas/${id}/gerar-link`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Buscar assinaturas por status (corretor logado)
   */
  buscarPorStatus(status: string): Observable<Assinatura[]> {
    return this.http.get<Assinatura[]>(`${this.baseUrl}/Assinaturas/status/${status}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // ============================================
  // MÉTODOS UTILITÁRIOS
  // ============================================

  /**
   * Verificar se usuário está autenticado
   */
  isAuthenticated(): boolean {
    const token = sessionStorage.getItem('auth-token');
    return !!token && token.trim() !== '';
  }

  /**
   * Limpar dados de autenticação
   */
  clearAuth(): void {
    sessionStorage.removeItem('auth-token');
  }

  /**
   * Obter informações do token (se disponível)
   */
  getTokenInfo(): any {
    const token = sessionStorage.getItem('auth-token');
    if (!token) return null;

    try {
      // Se for JWT, decodificar a parte do payload
      const payload = token.split('.')[1];
      if (payload) {
        return JSON.parse(atob(payload));
      }
    } catch (error) {
      console.warn('Erro ao decodificar token:', error);
    }
    
    return null;
  }
}