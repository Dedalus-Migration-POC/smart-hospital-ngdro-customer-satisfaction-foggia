import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { SurveyAdminState } from './store/store'
import { AppActions } from './store/application/actions'
import { NavigationEnd, Router } from '@angular/router'
import { filter } from 'rxjs'

@Component({
  selector: 'app-root',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  constructor(
    private store: Store<SurveyAdminState>,
    private router: Router,
  ) {}

  ngOnInit() {
    this.store.dispatch(AppActions.initialize())
    this.changeBg()
  }

  bgClass = ''
  changeBg() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const { url } = event as NavigationEnd
        switch (url) {
          case '/':
            this.bgClass = 'img-bg'
            break
          case '/login':
            this.bgClass = 'img-bg'
            break

          default:
            this.bgClass = 'grey-color-bg'
        }
      })
  }
}
