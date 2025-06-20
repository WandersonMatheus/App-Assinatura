import { Component, Input } from '@angular/core';
import { Assinatura } from '../../models/Assinatura.model';
import { AssinaturasService } from '../../services/assinaturas.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-assinatura',
  imports: [CommonModule],
  templateUrl: './card-assinatura.component.html',
  styleUrl: './card-assinatura.component.scss'
})
export class CardAssinaturaComponent {
  @Input() assinatura!: Assinatura;
  
  nomeCliente: string = 'Carregando...';
  nomesTermos: string[] = [];
  carregando = true;
  gerandoLink = false;

  constructor(private assinaturaService: AssinaturasService) { }

  copiarLink(): void {
    if (this.assinatura.linkAssinatura) {
      navigator.clipboard.writeText(this.assinatura.linkAssinatura)
        .then(() => alert('Link copiado para clipboard!'))
        .catch(() => alert('Erro ao copiar o link'));
    }
  }

  gerarLink(): void {
    this.gerandoLink = true;
    this.assinaturaService.gerarLink(this.assinatura.id).subscribe({
      next: (assinaturaAtualizada) => {
        this.assinatura = assinaturaAtualizada;
        this.gerandoLink = false;
        
        // Copiar link para clipboard
        navigator.clipboard.writeText(assinaturaAtualizada.linkAssinatura!);
        alert('Link copiado para clipboard!');
      },
      error: () => {
        this.gerandoLink = false;
        alert('Erro ao gerar link');
      }
    });
  }
get dataFormatada(): string {
  return new Date(this.assinatura.dataCriacao).toLocaleDateString('pt-BR', {
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
}
