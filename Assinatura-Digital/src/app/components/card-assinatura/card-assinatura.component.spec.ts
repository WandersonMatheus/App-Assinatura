import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAssinaturaComponent } from './card-assinatura.component';

describe('CardAssinaturaComponent', () => {
  let component: CardAssinaturaComponent;
  let fixture: ComponentFixture<CardAssinaturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardAssinaturaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardAssinaturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
