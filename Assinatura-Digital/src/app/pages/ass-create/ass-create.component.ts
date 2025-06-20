import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from "../../templates/header/header.component";
import { FooterComponent } from "../../templates/footer/footer.component";
import { Cliente } from '../../models/Cliente.model';
import { CommonModule } from '@angular/common';
import { Route, Router } from '@angular/router';
import { Termo } from '../../models/Termo.model';
import { HttpHeaders } from '@angular/common/http';
import { Assinatura } from '../../models/Assinatura.model';
import { AssinaturasService } from '../../services/assinaturas.service';

@Component({
  selector: 'app-ass-create',
  imports: [ReactiveFormsModule, HeaderComponent, FooterComponent,CommonModule],
  templateUrl: './ass-create.component.html',
  styleUrls: ['./ass-create.component.scss']  // <- corrigido
})
export class AssCreateComponent {
  pdfSelecionado!: File;
  form: FormGroup;
  clientes: Cliente[] = [];
  termos: any[] = [];
  cenarios: any[] = [];
  linkGerado: string | null = null;
  assinatura!: Assinatura;

  constructor(private fb: FormBuilder, private http: HttpClient,private router: Router,  private assinaturasService: AssinaturasService
) {
    this.form = this.fb.group({
      clienteId: [''],
      termoId: [''],
      cenarioId: ['']
    });
  }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.pdfSelecionado = input.files[0];
    }
  }

/*
  gerarLink() {
  console.log('=== FRONTEND DEBUG ===');
  console.log('clienteId:', this.form.get('clienteId')?.value);
  console.log('termoId:', this.form.get('termoId')?.value);
  console.log('cenarioId:', this.form.get('cenarioId')?.value);
  console.log('pdfSelecionado:', this.pdfSelecionado);

  if (!this.pdfSelecionado) {
    alert('Por favor, selecione um arquivo PDF');
    return;
  }

  const formData = new FormData();
  formData.append('clienteId', this.form.get('clienteId')?.value);
  formData.append('termoId', this.form.get('termoId')?.value);
  formData.append('cenarioId', this.form.get('cenarioId')?.value);
  formData.append('pdf', this.pdfSelecionado); // CORRIGIDO: 'pdf' em vez de 'pdfFile'

  const token = sessionStorage.getItem('auth-token');
  console.log('Token:', token ? 'Presente' : 'Ausente');

  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  // CORRIGIDO: URL sem '/criar'
  this.http.post('http://localhost:8080/Assinaturas', formData, { headers })
    .subscribe({
      next: (res: any) => {
        console.log('Resposta recebida:', res);
        this.linkGerado = res.linkAssinatura || 'Link gerado com sucesso';
      },
      error: (error) => {
        console.error('Erro completo:', error);
        alert('Erro ao criar assinatura: ' + error.message);
      }
    });
} */

gerarLinkAssinatura() {
  if (!this.pdfSelecionado) {
    alert('Por favor, selecione um arquivo PDF');
    return;
  }

  const formData = new FormData();
  formData.append('clienteId', this.form.get('clienteId')?.value);
  formData.append('termoId', this.form.get('termoId')?.value);
  formData.append('cenarioId', this.form.get('cenarioId')?.value);
  formData.append('pdf', this.pdfSelecionado);

  const token = sessionStorage.getItem('auth-token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  // 1 - Criar assinatura
  this.http.post<Assinatura>('http://localhost:8080/Assinaturas', formData, { headers })
    .subscribe({
      next: assinaturaCriada => {
        this.assinatura = assinaturaCriada;

        // 2 - Gerar link usando o ID que veio na resposta
        this.assinaturasService.gerarLink(assinaturaCriada.id).subscribe({
          next: assinaturaAtualizada => {
            this.assinatura = assinaturaAtualizada;
            this.linkGerado = assinaturaAtualizada.linkAssinatura || null;
            alert('Link gerado: ' + this.linkGerado);
          },
          error: () => alert('Erro ao gerar link')
        });
      },
      error: err => {
        alert('Erro ao criar assinatura: ' + err.message);
      }
    });
}


  ngOnInit(): void {
    this.http.get<Cliente[]>('http://localhost:8080/clientes').subscribe(res => this.clientes = res);
    this.http.get<Termo[]>('http://localhost:8080/termos/lista').subscribe(res=> this.termos = res);
    this.http.get('/api/cenarios').subscribe((res: any) => this.cenarios = res);
  }
  copiarLink() {
    if (this.linkGerado) {
      navigator.clipboard.writeText(this.linkGerado);
      alert('Link copiado para a área de transferência!');
    }
  }
  criarCliente() {
    this.router.navigate(["Assinaturas/create/RegistroClientes"])
  }
}
