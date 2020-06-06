import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ZolaPage } from './zola.page';

describe('ZolaPage', () => {
  let component: ZolaPage;
  let fixture: ComponentFixture<ZolaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZolaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ZolaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
