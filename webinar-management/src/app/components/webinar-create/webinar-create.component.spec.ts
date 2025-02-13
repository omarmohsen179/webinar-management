import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebinarCreateComponent } from './webinar-create.component';

describe('WebinarCreateComponent', () => {
  let component: WebinarCreateComponent;
  let fixture: ComponentFixture<WebinarCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebinarCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebinarCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
