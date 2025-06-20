import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl
} from '@angular/forms';
import { LoginLayoutComponent } from '../../layout/login-layout/login-layout.component';
import { PrimaryinputComponent } from '../../components/primaryinput/primaryinput.component';
import { Router } from '@angular/router';
import { LoginServicesService } from '../../services/login-services.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [LoginLayoutComponent,ReactiveFormsModule, PrimaryinputComponent],
  providers: [LoginServicesService],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  loginForm!: FormGroup;


  constructor(
    private router:Router,
    private loginService:LoginServicesService,
    private toastr: ToastrService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }
  submit(){
    this.loginService.login(this.loginForm.value.email,this.loginForm.value.password).subscribe({
      next: () => {
        this.toastr.success("Login realizado com sucesso");
        this.router.navigate(['/home']); // redireciona para a home
      },
      error:()=> this.toastr.error("Ops! Ocorreu um erro ao tentar conexão,tente novamente mais tarde.")
    })
  }
  navigate(){
    this.router.navigate(["Cadastro"]);
  }
}
