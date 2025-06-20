import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Assinatura } from '../../models/Assinatura.model';
import { AssinaturasService } from '../../services/assinaturas.service';
import { CardAssinaturaComponent } from '../../components/card-assinatura/card-assinatura.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-assinaturas-lista',
  imports: [CommonModule,CardAssinaturaComponent],
  templateUrl: './assinaturas-lista.component.html',
  styleUrl: './assinaturas-lista.component.scss'
})
export class AssinaturasListaComponent implements OnInit {

    assinaturas: Assinatura[] = [];
    carregando = false;
    erro: string | null = null;

    constructor(private assinaturaService: AssinaturasService,    private router: Router) { }

    ngOnInit(): void {
      this.carregarAssinaturas();
    }

    criarAssinaturas() {
      this.router.navigate(['/Assinaturas/create']);
    }
    carregarAssinaturas(): void {
      this.carregando = true;
      this.erro = null;
      
      this.assinaturaService.listarAssinaturas().subscribe({
        next: (dados) => {
          // Pegar apenas as 10 mais recentes
          this.assinaturas = dados
            .sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime())
            .slice(0, 10);
          this.carregando = false;
        },
        error: (error) => {
          this.erro = 'Erro ao carregar assinaturas';
          this.carregando = false;
          console.error('Erro:', error);
        }
      });
    }
}
