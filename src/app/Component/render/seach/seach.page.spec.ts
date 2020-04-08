import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SeachPage } from './seach.page';

describe('SeachPage', () => {
  let component: SeachPage;
  let fixture: ComponentFixture<SeachPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeachPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SeachPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
