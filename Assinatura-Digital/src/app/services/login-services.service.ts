import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../types/login-response.type';
import { ValueChangeEvent } from '@angular/forms';
import { Token } from '@angular/compiler';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginServicesService {
  apiUrl: string = "http://localhost:8080/auth"

  constructor(private httpClient: HttpClient) { }

  login(email:string,password:string){
    return this.httpClient.post<LoginResponse>(this.apiUrl + "/login",{email,password}).pipe(
        tap((value)=>{
              sessionStorage.setItem("auth-token",value.token)
              sessionStorage.setItem("username",value.nome)
            })
    )
  }
  signup(nome:string,email:string,password:string){
    return this.httpClient.post<LoginResponse>(this.apiUrl + "/register",{nome,email,password}).pipe(
        tap((value)=>{
              sessionStorage.setItem("auth-token",value.token)
              sessionStorage.setItem("username",value.nome)
            })
    )
  }
}
