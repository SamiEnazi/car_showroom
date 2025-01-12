import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowroomCarsComponent } from './showroom-cars.component';

describe('ShowroomCarsComponent', () => {
  let component: ShowroomCarsComponent;
  let fixture: ComponentFixture<ShowroomCarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowroomCarsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowroomCarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
