import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssinaturaPublicaComponent } from './assinatura-publica.component';

describe('AssinaturaPublicaComponent', () => {
  let component: AssinaturaPublicaComponent;
  let fixture: ComponentFixture<AssinaturaPublicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssinaturaPublicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssinaturaPublicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
