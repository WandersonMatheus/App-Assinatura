import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Assinatura } from '../../models/Assinatura.model';
import { AssinaturasService } from '../../services/assinaturas.service';
import { CardAssinaturaComponent } from '../../components/card-assinatura/card-assinatura.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-assinaturas-lista',
  standalone: true,
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
  carregarAssinaturas() {
    this.carregando = true;
    this.erro = null;
    
    this.assinaturaService.listarAssinaturas().subscribe({
      next: (data) => {
        this.assinaturas = data;
        this.carregando = false;
        console.log('Assinaturas carregadas:', data); // 🔍 Debug
      },
      error: (error) => {
        console.error('Erro ao carregar assinaturas:', error); // 🔍 Debug
        this.erro = 'Erro ao carregar assinaturas';
        this.carregando = false;
      }
    });
  }
}
