import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-login-layout',
  standalone: true,
  imports: [],
  templateUrl: './login-layout.component.html',
  styleUrl: './login-layout.component.scss'
})
export class LoginLayoutComponent {
  @Input() title:  String = "";
  @Input() primarybtntext:  String = "";
  @Input() secondarybtntext:  String = "";
  @Input() disableLogin: boolean = true;
  @Output("submit") onSubmit= new EventEmitter();
  @Output("navigate") onNavigate = new EventEmitter();

  submit(){
    this.onSubmit.emit();
  }
  navigate(){
    this.onNavigate.emit();
  }
}
