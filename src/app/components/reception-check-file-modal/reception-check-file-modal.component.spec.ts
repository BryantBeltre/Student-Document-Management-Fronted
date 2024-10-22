import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionCheckFileModalComponent } from './reception-check-file-modal.component';

describe('ReceptionCheckFileModalComponent', () => {
  let component: ReceptionCheckFileModalComponent;
  let fixture: ComponentFixture<ReceptionCheckFileModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceptionCheckFileModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceptionCheckFileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
