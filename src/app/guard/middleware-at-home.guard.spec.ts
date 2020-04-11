import { TestBed, async, inject } from '@angular/core/testing';

import { MiddlewareAtHomeGuard } from './middleware-at-home.guard';

describe('MiddlewareAtHomeGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MiddlewareAtHomeGuard]
    });
  });

  it('should ...', inject([MiddlewareAtHomeGuard], (guard: MiddlewareAtHomeGuard) => {
    expect(guard).toBeTruthy();
  }));
});
