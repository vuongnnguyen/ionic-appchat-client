import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InfUserPage } from './inf-user.page';

describe('InfUserPage', () => {
  let component: InfUserPage;
  let fixture: ComponentFixture<InfUserPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfUserPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InfUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
