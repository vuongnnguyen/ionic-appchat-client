import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MsgPage } from './msg.page';

describe('MsgPage', () => {
  let component: MsgPage;
  let fixture: ComponentFixture<MsgPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsgPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MsgPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
