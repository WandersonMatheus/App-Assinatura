import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AssinaturasListaComponent } from "../../pages/assinaturas-lista/assinaturas-lista.component";

@Component({
  selector: 'app-home-layout',
  imports: [AssinaturasListaComponent],
  templateUrl: './home-layout.component.html',
  styleUrl: './home-layout.component.scss'
})
export class HomeLayoutComponent implements OnInit {
username: string = "";

  ngOnInit(): void {
    this.username = sessionStorage.getItem("username") ?? "";
  }

}
