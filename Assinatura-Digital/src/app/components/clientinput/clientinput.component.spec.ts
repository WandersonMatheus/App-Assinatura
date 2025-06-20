import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientinputComponent } from './clientinput.component';

describe('ClientinputComponent', () => {
  let component: ClientinputComponent;
  let fixture: ComponentFixture<ClientinputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientinputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientinputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
