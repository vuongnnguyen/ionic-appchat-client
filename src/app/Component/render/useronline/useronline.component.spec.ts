import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UseronlineComponent } from './useronline.component';

describe('UseronlineComponent', () => {
  let component: UseronlineComponent;
  let fixture: ComponentFixture<UseronlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UseronlineComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UseronlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
