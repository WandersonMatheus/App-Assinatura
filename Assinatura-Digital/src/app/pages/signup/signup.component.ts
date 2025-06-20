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
  selector: 'app-signup',
  standalone: true,
  imports: [LoginLayoutComponent,ReactiveFormsModule, PrimaryinputComponent],
  providers: [LoginServicesService],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm!: FormGroup;


  constructor(
    private router:Router,
    private loginService:LoginServicesService,
    private toastr: ToastrService
  ) {
    this.signupForm = new FormGroup({
      nome: new FormControl('', [Validators.required, Validators.min(4)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }
  submit(){
    this.loginService.signup(this.signupForm.value.nome,this.signupForm.value.email,this.signupForm.value.password).subscribe({
      next:()=>{
        this.toastr.success("Cadastro realizado com sucesso"),
        this.router.navigate(['/login']);
      },
      error:()=> this.toastr.error("Ops! Ocorreu um erro ao tentar realizar o cadastro,tente novamente mais tarde.")
    })
  }
  navigate(){
    this.router.navigate(["login"]);
  }
}
