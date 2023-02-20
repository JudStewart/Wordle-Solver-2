import { TestBed } from '@angular/core/testing';

import { ContrastModeService } from './contrast-mode.service';

describe('ContrastModeService', () => {
  let service: ContrastModeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContrastModeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
