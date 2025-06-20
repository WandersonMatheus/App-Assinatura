import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListcenaComponent } from './listcena.component';

describe('ListcenaComponent', () => {
  let component: ListcenaComponent;
  let fixture: ComponentFixture<ListcenaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListcenaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListcenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
