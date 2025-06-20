import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListclientsComponent } from './listclients.component';

describe('ListclientsComponent', () => {
  let component: ListclientsComponent;
  let fixture: ComponentFixture<ListclientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListclientsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListclientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
