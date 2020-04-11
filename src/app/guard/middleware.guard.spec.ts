import { TestBed, async, inject } from '@angular/core/testing';

import { MiddlewareGuard } from './middleware.guard';

describe('MiddlewareGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MiddlewareGuard]
    });
  });

  it('should ...', inject([MiddlewareGuard], (guard: MiddlewareGuard) => {
    expect(guard).toBeTruthy();
  }));
});
