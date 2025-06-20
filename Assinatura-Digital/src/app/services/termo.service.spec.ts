import { TestBed } from '@angular/core/testing';

import { TermoService } from './termo.service';

describe('TermoService', () => {
  let service: TermoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TermoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
