import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssinaturasListaComponent } from './assinaturas-lista.component';

describe('AssinaturasListaComponent', () => {
  let component: AssinaturasListaComponent;
  let fixture: ComponentFixture<AssinaturasListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssinaturasListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssinaturasListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
