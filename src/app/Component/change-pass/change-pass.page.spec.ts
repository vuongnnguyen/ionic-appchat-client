import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChangePassPage } from './change-pass.page';

describe('ChangePassPage', () => {
  let component: ChangePassPage;
  let fixture: ComponentFixture<ChangePassPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangePassPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
