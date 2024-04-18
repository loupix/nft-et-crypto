import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppendComponent } from './append.component';

describe('AppendComponent', () => {
  let component: AppendComponent;
  let fixture: ComponentFixture<AppendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppendComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
