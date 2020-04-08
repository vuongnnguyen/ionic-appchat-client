import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RenderPage } from './render.page';

describe('RenderPage', () => {
  let component: RenderPage;
  let fixture: ComponentFixture<RenderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RenderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
