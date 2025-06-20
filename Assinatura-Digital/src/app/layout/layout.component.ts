import { Component } from '@angular/core';
import { HeaderComponent } from '../templates/header/header.component';
import { FooterComponent } from '../templates/footer/footer.component';
import { BodyComponent } from '../templates/body/body.component';

@Component({
  selector: 'app-layout',
  imports: [HeaderComponent,FooterComponent,BodyComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
