import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentStudentModalComponent } from './document-student-modal.component';

describe('DocumentStudentModalComponent', () => {
  let component: DocumentStudentModalComponent;
  let fixture: ComponentFixture<DocumentStudentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentStudentModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentStudentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
