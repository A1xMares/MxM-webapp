import { TestBed } from '@angular/core/testing';

import { PdfPreviewService } from './pdf-preview.service';

describe('PdfPreviewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PdfPreviewService = TestBed.get(PdfPreviewService);
    expect(service).toBeTruthy();
  });
});
