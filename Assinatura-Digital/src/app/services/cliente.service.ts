import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Cliente } from '../models/Cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private http: HttpClient) {}

  cadastrar(dados: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>('http://localhost:8080/clientes', dados);
  }
  listar(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>('http://localhost:8080/clientes');
  }
}
