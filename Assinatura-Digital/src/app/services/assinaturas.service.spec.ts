import { TestBed } from '@angular/core/testing';

import { AssinaturasService } from './assinaturas.service';

describe('AssinaturasService', () => {
  let service: AssinaturasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssinaturasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
