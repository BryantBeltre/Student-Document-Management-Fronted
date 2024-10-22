import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenteDepartamentalHomeComponent } from './gerente-departamental-home.component';

describe('GerenteDepartamentalHomeComponent', () => {
  let component: GerenteDepartamentalHomeComponent;
  let fixture: ComponentFixture<GerenteDepartamentalHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenteDepartamentalHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerenteDepartamentalHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
