import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AssinaturasService } from '../../services/assinaturas.service';
import { Assinatura } from '../../models/Assinatura.model';
import { SafeUrlPipe } from "../../pipes/safe-url.pipe";
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import * as faceapi from 'face-api.js';

@Component({
  selector: 'app-assinatura-publica',
  standalone: true,  // <-- importante para funcionar o imports abaixo
  templateUrl: './assinatura-publica.component.html',
  styleUrls: ['./assinatura-publica.component.scss'],
  imports: [SafeUrlPipe, CommonModule, FormsModule]
})
export class AssinaturaPublicaComponent implements OnInit, OnDestroy {
  assinatura!: Assinatura;
  pdfUrl: SafeResourceUrl | null = null;
  carregando = true;
  erro: string | null = null;
  assinaturaId: string | null = null;
  cpfInformado: string = '';
  selfieBase64: string | null = null;
  selfiePreview: string | null = null;
  processandoAssinatura = false;
  faceDetectada: boolean = false;

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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.selfieBase64 = reader.result as string;
      this.selfiePreview = this.selfieBase64;
    };
    reader.onerror = () => {
      alert('Erro ao ler o arquivo');
    };
    reader.readAsDataURL(file);
  }

  public carregarAssinatura(): void {
    if (!this.assinaturaId) return;

    this.carregando = true;
    this.erro = null;

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

    this.assinaturasService.obterPdfAssinatura(this.assinaturaId).subscribe({
      next: (pdfBlob) => {
        if (this.pdfUrl) {
          this.liberarRecursosPdf();
        }
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

  async confirmarAssinatura(): Promise<void> {
    if (!this.assinaturaId || this.jaAssinada || this.processandoAssinatura) return;

    if (!this.cpfInformado.trim()) {
      alert('CPF é obrigatório');
      return;
    }

    if (!this.selfieBase64) {
      alert('Selfie é obrigatória');
      return;
    }

    const cpfLimpo = this.cpfInformado.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
      alert('CPF deve conter 11 dígitos');
      return;
    }

    if (!confirm('Tem certeza que deseja confirmar a assinatura?')) {
      return;
    }

    this.processandoAssinatura = true;

    try {
      const ip = await this.capturarIp();
      const local = await this.capturarLocalizacao();

      const payload = {
        cpfInformado: cpfLimpo,
        selfieBase64: this.selfieBase64,
        ipAssinatura: ip,
        localizacao: local ? `${local.latitude}, ${local.longitude}` : 'Localização não disponível'
      };

      // Aqui você deve usar o método correto que envia todos os dados para backend
      this.assinaturasService.confirmarAssinatura(this.assinaturaId, payload).subscribe({
        next: (assinaturaAtualizada) => {
          this.assinatura = assinaturaAtualizada;
          alert('Assinatura confirmada com sucesso!');
          this.cpfInformado = '';
          this.selfieBase64 = null;
          this.selfiePreview = null;
        },
        error: (error) => {
          console.error('Erro ao confirmar assinatura:', error);
          alert('Erro ao confirmar assinatura. Verifique os dados e tente novamente.');
        },
        complete: () => {
          this.processandoAssinatura = false;
        }
      });
    } catch (error) {
      console.error('Erro ao processar assinatura:', error);
      alert('Erro ao processar assinatura. Tente novamente.');
      this.processandoAssinatura = false;
    }
  }

  private capturarLocalizacao(): Promise<{ latitude: number; longitude: number } | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn('Geolocalização não suportada');
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Erro ao obter localização:', error.message);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    });
  }

  private async capturarIp(): Promise<string> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch('https://api.ipify.org?format=json', { signal: controller.signal });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      return data.ip || 'IP desconhecido';
    } catch (error) {
      console.error('Erro ao obter IP:', error);
      return 'IP desconhecido';
    }
  }

  baixarPdf(): void {
    if (!this.assinaturaId) return;

    this.assinaturasService.obterPdfAssinatura(this.assinaturaId).subscribe({
      next: (pdfBlob) => {
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `documento-${this.assinaturaId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Erro ao baixar PDF:', error);
        alert('Erro ao baixar documento');
      }
    });
  }

  get jaAssinada(): boolean {
    return this.assinatura?.status === 'ASSINADA';
  }

  get podeAssinar(): boolean {
    return !this.jaAssinada && this.assinatura?.status === 'LINK_ENVIADO';
  }

  formatarData(data: string | undefined): string {
    if (!data) return '';
    try {
      return new Date(data).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  }

  formatarCpf(cpf: string): string {
    if (!cpf) return '';
    const cpfLimpo = cpf.replace(/\D/g, '');
    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  aplicarMascaraCpf(event: Event): void {
    const input = event.target as HTMLInputElement;
    let valor = input.value.replace(/\D/g, '');
    
    if (valor.length <= 11) {
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
      valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    
    input.value = valor;
    this.cpfInformado = valor;
  }

  private liberarRecursosPdf(): void {
    if (this.pdfUrl) {
      const url = (this.pdfUrl as any).changingThisBreaksApplicationSecurity;
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    }
  }

  ngOnDestroy(): void {
    this.liberarRecursosPdf();
  }
}