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
  imports: [ReactiveFormsModule, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './ass-create.component.html',
  styleUrls: ['./ass-create.component.scss']
})
export class AssCreateComponent {
  pdfSelecionado!: File;
  form: FormGroup;
  clientes: Cliente[] = [];
  termos: any[] = [];
  cenarios: any[] = [];
  linkGerado: string | null = null;
  assinatura!: Assinatura;

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,
    private router: Router,  
    private assinaturasService: AssinaturasService
  ) {
    this.form = this.fb.group({
      clienteId: [''],
      termoId: [''],
      cenarioId: [''] // Pode ficar vazio
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.pdfSelecionado = input.files[0];
    }
  }

  gerarLinkAssinatura() {
    console.log('=== FRONTEND DEBUG ===');
    console.log('clienteId:', this.form.get('clienteId')?.value);
    console.log('termoId:', this.form.get('termoId')?.value);
    console.log('cenarioId:', this.form.get('cenarioId')?.value);
    console.log('pdfSelecionado:', this.pdfSelecionado);

    if (!this.pdfSelecionado) {
      alert('Por favor, selecione um arquivo PDF');
      return;
    }

    // Validar campos obrigatórios
    const clienteId = this.form.get('clienteId')?.value;
    const termoId = this.form.get('termoId')?.value;

    if (!clienteId || !termoId) {
      alert('Por favor, selecione um cliente e um termo');
      return;
    }

    const formData = new FormData();
    formData.append('clienteId', clienteId);
    formData.append('termoId', termoId);
    
    // ✅ CORREÇÃO: Só enviar cenarioId se não for vazio
    const cenarioId = this.form.get('cenarioId')?.value;
    if (cenarioId && cenarioId.trim() !== '') {
      formData.append('cenarioId', cenarioId);
    }
    // Se cenarioId estiver vazio, não enviamos o parâmetro
    
    formData.append('pdf', this.pdfSelecionado);

    const token = sessionStorage.getItem('auth-token');
    console.log('Token:', token ? 'Presente' : 'Ausente');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // 1 - Criar assinatura
    this.http.post<Assinatura>('http://localhost:8080/Assinaturas', formData, { headers })
      .subscribe({
        next: assinaturaCriada => {
          console.log('Assinatura criada:', assinaturaCriada);
          this.assinatura = assinaturaCriada;

          // 2 - Gerar link usando o ID que veio na resposta
          this.assinaturasService.gerarLink(assinaturaCriada.id).subscribe({
            next: assinaturaAtualizada => {
              this.assinatura = assinaturaAtualizada;
              this.linkGerado = assinaturaAtualizada.linkAssinatura || null;
              alert('Link gerado com sucesso!');
              console.log('Link gerado:', this.linkGerado);
            },
            error: (error) => {
              console.error('Erro ao gerar link:', error);
              alert('Erro ao gerar link: ' + error.message);
            }
          });
        },
        error: (error) => {
          console.error('Erro completo ao criar assinatura:', error);
          console.error('Status:', error.status);
          console.error('Mensagem:', error.message);
          console.error('Body:', error.error);
          
          let mensagemErro = 'Erro desconhecido';
          if (error.status === 400) {
            mensagemErro = 'Dados inválidos. Verifique se o cliente e termo existem.';
          } else if (error.status === 401) {
            mensagemErro = 'Acesso não autorizado. Faça login novamente.';
          } else if (error.error && error.error.message) {
            mensagemErro = error.error.message;
          }
          
          alert('Erro ao criar assinatura: ' + mensagemErro);
        }
      });
  }

  ngOnInit(): void {
    // Carregar dados necessários
    this.carregarClientes();
    this.carregarTermos();
    this.carregarCenarios();
  }

  private carregarClientes() {
    const token = sessionStorage.getItem('auth-token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    this.http.get<Cliente[]>('http://localhost:8080/clientes', { headers })
      .subscribe({
        next: (res) => {
          this.clientes = res;
          console.log('Clientes carregados:', res.length);
        },
        error: (error) => {
          console.error('Erro ao carregar clientes:', error);
        }
      });
  }

  private carregarTermos() {
    const token = sessionStorage.getItem('auth-token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    this.http.get<Termo[]>('http://localhost:8080/termos/lista', { headers })
      .subscribe({
        next: (res) => {
          this.termos = res;
          console.log('Termos carregados:', res.length);
        },
        error: (error) => {
          console.error('Erro ao carregar termos:', error);
        }
      });
  }

  private carregarCenarios() {
    // Se você tem cenários, implemente aqui
    // Por enquanto deixamos vazio já que não é obrigatório
    this.cenarios = [];
  }

  copiarLink() {
    if (this.linkGerado) {
      navigator.clipboard.writeText(this.linkGerado);
      alert('Link copiado para a área de transferência!');
    }
  }

  criarCliente() {
    this.router.navigate(["Assinaturas/create/RegistroClientes"]);
  }
}