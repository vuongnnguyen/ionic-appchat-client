import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserstatusComponent } from './userstatus.component';

describe('UserstatusComponent', () => {
  let component: UserstatusComponent;
  let fixture: ComponentFixture<UserstatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserstatusComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
