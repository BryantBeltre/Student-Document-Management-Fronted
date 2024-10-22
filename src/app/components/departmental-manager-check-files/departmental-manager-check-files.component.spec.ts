import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentalManagerCheckFilesComponent } from './departmental-manager-check-files.component';

describe('DepartmentalManagerCheckFilesComponent', () => {
  let component: DepartmentalManagerCheckFilesComponent;
  let fixture: ComponentFixture<DepartmentalManagerCheckFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentalManagerCheckFilesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentalManagerCheckFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
