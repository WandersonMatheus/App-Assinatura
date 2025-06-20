import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryinputComponent } from './primaryinput.component';

describe('PrimaryinputComponent', () => {
  let component: PrimaryinputComponent;
  let fixture: ComponentFixture<PrimaryinputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimaryinputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimaryinputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
