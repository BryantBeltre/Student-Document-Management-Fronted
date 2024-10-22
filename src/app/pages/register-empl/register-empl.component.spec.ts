import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterEmplComponent } from './register-empl.component';

describe('RegisterEmplComponent', () => {
  let component: RegisterEmplComponent;
  let fixture: ComponentFixture<RegisterEmplComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterEmplComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterEmplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
