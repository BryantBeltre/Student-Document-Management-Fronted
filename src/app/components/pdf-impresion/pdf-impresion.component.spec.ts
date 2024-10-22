import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfImpresionComponent } from './pdf-impresion.component';

describe('PdfImpresionComponent', () => {
  let component: PdfImpresionComponent;
  let fixture: ComponentFixture<PdfImpresionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfImpresionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfImpresionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
