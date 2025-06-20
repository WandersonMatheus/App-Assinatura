import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Termo } from '../models/Termo.model';

@Injectable({
  providedIn: 'root'
})
export class TermoService {

  constructor(private http: HttpClient) {}

  cadastrar(dados: Termo): Observable<Termo> {
    return this.http.post<Termo>('http://localhost:8080/termos', dados);
  }
  listar(): Observable<Termo[]> {
    return this.http.get<Termo[]>('http://localhost:8080/termos/lista');
  }
}
