import { TestBed } from '@angular/core/testing';

import { ChatServicesService } from './chat-services.service';

describe('ChatServicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChatServicesService = TestBed.get(ChatServicesService);
    expect(service).toBeTruthy();
  });
});
