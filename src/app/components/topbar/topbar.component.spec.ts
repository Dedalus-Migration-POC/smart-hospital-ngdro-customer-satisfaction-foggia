import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideMockStore } from '@ngrx/store/testing'
import { BehaviorSubject } from 'rxjs'
import { DEPLOY_URL } from 'src/constants'
import * as fromAuth from 'src/app/pages/auth/auth.reducer'
import { TopbarComponent } from './topbar.component'
import { AuthService } from 'src/app/pages/auth/auth.service'

describe('TopbarComponent', () => {
  let component: TopbarComponent
  let fixture: ComponentFixture<TopbarComponent>

  const mockAuthService = jasmine.createSpyObj<AuthService>([
    'getPersonBS',
    'logout',
  ])
  mockAuthService.getPersonBS.and.returnValue(new BehaviorSubject(null))

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopbarComponent],
      providers: [
        { provide: DEPLOY_URL, useValue: '/' },
        { provide: AuthService, useValue: mockAuthService },
        provideMockStore({
          initialState: {
            [fromAuth.featureKey]: fromAuth.initialState,
          },
        }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()

    fixture = TestBed.createComponent(TopbarComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
