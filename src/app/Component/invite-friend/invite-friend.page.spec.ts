import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InviteFriendPage } from './invite-friend.page';

describe('InviteFriendPage', () => {
  let component: InviteFriendPage;
  let fixture: ComponentFixture<InviteFriendPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteFriendPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InviteFriendPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
