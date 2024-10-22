import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFileStudentComponent } from './update-file-student.component';

describe('UpdateFileStudentComponent', () => {
  let component: UpdateFileStudentComponent;
  let fixture: ComponentFixture<UpdateFileStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateFileStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateFileStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
