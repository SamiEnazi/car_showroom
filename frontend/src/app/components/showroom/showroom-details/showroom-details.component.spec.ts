import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowroomDetailsComponent } from './showroom-details.component';

describe('ShowroomDetailsComponent', () => {
  let component: ShowroomDetailsComponent;
  let fixture: ComponentFixture<ShowroomDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowroomDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowroomDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
