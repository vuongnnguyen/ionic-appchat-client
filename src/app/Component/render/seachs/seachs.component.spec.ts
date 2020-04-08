import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SeachsComponent } from './seachs.component';

describe('SeachsComponent', () => {
  let component: SeachsComponent;
  let fixture: ComponentFixture<SeachsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeachsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SeachsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
