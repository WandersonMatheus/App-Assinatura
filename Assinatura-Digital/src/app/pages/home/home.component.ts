import { Component } from '@angular/core';
import { HeaderComponent } from '../../templates/header/header.component';
import { FooterComponent } from "../../templates/footer/footer.component";
import { HomeLayoutComponent } from "../../layout/home-layout/home-layout.component";

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, FooterComponent, HomeLayoutComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
