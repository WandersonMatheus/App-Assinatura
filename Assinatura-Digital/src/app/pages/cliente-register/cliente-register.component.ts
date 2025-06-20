import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-cliente-register',
  imports: [ReactiveFormsModule],
  templateUrl: './cliente-register.component.html',
  styleUrls: ['./cliente-register.component.scss']
})
export class ClienteRegisterComponent {
  clienteForm = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.email]),
    telefone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{10,11}$/)
    ]),
    cpf: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{11}$/)
    ]),
    observacoes: new FormControl('')
  });

  constructor(
    private clienteService: ClienteService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  submit() {
    if (this.clienteForm.invalid) {
      this.toastr.warning('Preencha os campos obrigatórios.');
      return;
    }

    const cliente = this.clienteForm.value as any;

    this.clienteService.cadastrar(cliente).subscribe({
      next: () => {
        this.toastr.success('Cliente cadastrado com sucesso!');
        this.router.navigate(['Assinaturas/create']);
      },
      error: () => {
        this.toastr.error('Erro ao cadastrar cliente.');
      }
    });
  }
  voltar() {
    this.router.navigate(["Assinaturas/create"]);
  }
}
