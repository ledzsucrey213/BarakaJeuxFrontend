import { TestBed } from '@angular/core/testing';

import { GameLabelService } from './game-label.service';

describe('GameLabelService', () => {
  let service: GameLabelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameLabelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
