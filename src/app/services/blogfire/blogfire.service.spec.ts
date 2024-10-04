import { TestBed } from '@angular/core/testing';

import { BlogfireService } from './blogfire.service';

describe('BlogfireService', () => {
  let service: BlogfireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlogfireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
