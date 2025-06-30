// card-assinatura.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { Assinatura } from '../../models/Assinatura.model';
import { AssinaturasService } from '../../services/assinaturas.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-assinatura',
  standalone: true, // ✅ Mantenha standalone
  imports: [CommonModule],
  templateUrl: './card-assinatura.component.html',
  styleUrls: ['./card-assinatura.component.scss'] // ✅ Correção: styleUrls (plural)
})
export class CardAssinaturaComponent implements OnInit {
  @Input() assinatura!: Assinatura;
  
  nomeCliente: string = 'Carregando...';
  nomesTermos: string[] = [];
  carregando = true;
  gerandoLink = false;

  constructor(private assinaturaService: AssinaturasService) { }

  ngOnInit() {
    this.carregando = false; // ✅ Pare o loading inicial
    this.carregarDadosAdicionais();
  }

  carregarDadosAdicionais() {
    // Carregar nome do cliente se necessário
    if (this.assinatura.clienteId) {
      this.assinaturaService.buscarCliente(this.assinatura.clienteId).subscribe({
        next: (cliente) => {
          this.nomeCliente = cliente.nome || 'Cliente não encontrado';
        },
        error: () => {
          this.nomeCliente = 'Erro ao carregar cliente';
        }
      });
    }
  }

get dataFormatada(): string {
  // ✅ Verificação de segurança
  if (!this.assinatura?.dataAssinatura) {
    return 'Data não disponível';
  }
  
  return new Date(this.assinatura.dataAssinatura).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

  get statusClass(): string {
    switch(this.assinatura.status) {
      case 'CRIADA': return 'status-criada';
      case 'LINK_ENVIADO': return 'status-enviado';
      case 'ASSINADA': return 'status-assinada';
      default: return 'status-default';
    }
  }

  get statusTexto(): string {
    switch(this.assinatura.status) {
      case 'CRIADA': return 'Criada';
      case 'LINK_ENVIADO': return 'Link Enviado';
      case 'ASSINADA': return 'Assinada';
      default: return 'Desconhecido';
    }
  }

  copiarLink(): void {
    if (this.assinatura.linkAssinatura) {
      navigator.clipboard.writeText(this.assinatura.linkAssinatura)
        .then(() => alert('Link copiado para clipboard!'))
        .catch(() => alert('Erro ao copiar o link'));
    }
  }
    baixarPdf() {
    this.assinaturaService.obterPdfAssinatura(this.assinatura.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Assinatura-${this.assinatura.id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Erro ao baixar PDF:', err);
        alert('Não foi possível baixar o PDF.');
      }
    });
  }

  gerarLink(): void {
    this.gerandoLink = true;
    this.assinaturaService.gerarLink(this.assinatura.id).subscribe({
      next: (assinaturaAtualizada) => {
        this.assinatura = assinaturaAtualizada;
        this.gerandoLink = false;
        
        navigator.clipboard.writeText(assinaturaAtualizada.linkAssinatura!);
        alert('Link copiado para clipboard!');
      },
      error: () => {
        this.gerandoLink = false;
        alert('Erro ao gerar link');
      }
    });
  }
}