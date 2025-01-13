import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowroomCreateComponent } from './showroom-create.component';

describe('ShowroomCreateComponent', () => {
  let component: ShowroomCreateComponent;
  let fixture: ComponentFixture<ShowroomCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowroomCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowroomCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
