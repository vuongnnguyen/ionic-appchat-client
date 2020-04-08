import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NicknamesComponent } from './nicknames.component';

describe('NicknamesComponent', () => {
  let component: NicknamesComponent;
  let fixture: ComponentFixture<NicknamesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NicknamesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NicknamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
