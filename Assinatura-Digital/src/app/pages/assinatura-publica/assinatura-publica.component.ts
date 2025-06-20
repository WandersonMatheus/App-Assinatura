import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AssinaturasService } from '../../services/assinaturas.service';
import { Assinatura } from '../../models/Assinatura.model';
import { SafeUrlPipe } from "../../pipes/safe-url.pipe";
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-assinatura-publica',
  templateUrl: './assinatura-publica.component.html',
  styleUrls: ['./assinatura-publica.component.scss'],
  imports: [SafeUrlPipe, CommonModule]
})
export class AssinaturaPublicaComponent implements OnInit {
  assinatura!: Assinatura;
  pdfUrl: SafeResourceUrl | null = null;
  carregando = true;
  erro: string | null = null;
  assinaturaId: string | null = null;

  constructor(
    private assinaturasService: AssinaturasService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.assinaturaId = this.route.snapshot.paramMap.get('id');
    
    if (!this.assinaturaId) {
      this.erro = 'ID da assinatura não encontrado';
      this.carregando = false;
      return;
    }

    this.carregarAssinatura();
  }

  private carregarAssinatura(): void {
    if (!this.assinaturaId) return;

    // Buscar dados da assinatura
    this.assinaturasService.buscarAssinaturaPublica(this.assinaturaId).subscribe({
      next: (assinatura) => {
        this.assinatura = assinatura;
        this.carregarPdf();
      },
      error: (error) => {
        console.error('Erro ao carregar assinatura:', error);
        this.erro = 'Assinatura não encontrada ou link inválido';
        this.carregando = false;
      }
    });
  }

  private carregarPdf(): void {
    if (!this.assinaturaId) return;

    // Buscar PDF da assinatura
    this.assinaturasService.obterPdfAssinatura(this.assinaturaId).subscribe({
      next: (pdfBlob) => {
        // Criar URL do blob para exibir o PDF
        const pdfBlobUrl = URL.createObjectURL(pdfBlob);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfBlobUrl);
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao carregar PDF:', error);
        this.erro = 'Erro ao carregar o documento PDF';
        this.carregando = false;
      }
    });
  }

async assinar(): Promise<void> {
  if (!this.assinaturaId || this.jaAssinada) return;

  if (confirm('Tem certeza que deseja assinar este documento?')) {
    const ip = await this.capturarIp();
    const local = await this.capturarLocalizacao();

    const payload = {
      ipAssinatura: ip,
      localizacao: local ? `${local.latitude}, ${local.longitude}` : 'Localização não disponível'
    };

    this.assinaturasService.marcarComoAssinada(this.assinaturaId, payload).subscribe({
      next: (assinaturaAtualizada) => {
        this.assinatura = assinaturaAtualizada;
        alert('Documento assinado com sucesso!');
        this.carregarAssinatura();
      },
      error: (error) => {
        console.error('Erro ao assinar documento:', error);
        alert('Erro ao assinar documento. Tente novamente.');
      }
    });
  }
}
  capturarLocalizacao(): Promise<{ latitude: number, longitude: number } | null> {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          error => {
            console.warn('Erro ao obter localização:', error);
            resolve(null);
          }
        );
      } else {
        resolve(null);
      }
    });
  }
    async capturarIp(): Promise<string> {
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      return data.ip;
    } catch (error) {
      console.error('Erro ao obter IP:', error);
      return 'IP desconhecido';
    }
  }

  baixarPdf(): void {
    if (!this.assinaturaId) return;

    this.assinaturasService.obterPdfAssinatura(this.assinaturaId).subscribe({
      next: (pdfBlob) => {
        // Criar link para download
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `documento-${this.assinaturaId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Erro ao baixar PDF:', error);
        alert('Erro ao baixar documento');
      }
    });
  }

  // Verificar se a assinatura já foi assinada
  get jaAssinada(): boolean {
    return this.assinatura?.status === 'ASSINADA';
  }

  // Verificar se pode assinar
  get podeAssinar(): boolean {
    return !this.jaAssinada && this.assinatura?.status === 'LINK_ENVIADO';
  }

  // Formatar data
  formatarData(data: string): string {
    if (!data) return '';
    return new Date(data).toLocaleDateString('pt-BR');
  }

  // Limpar recursos quando componente for destruído
  ngOnDestroy(): void {
    if (this.pdfUrl) {
      // Liberar recursos do blob URL
      const url = (this.pdfUrl as any).changingThisBreaksApplicationSecurity;
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    }
  }
}