import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { LayoutComponent } from './layout.component'
import { DesignAngularKitModule } from 'design-angular-kit'
import { TopbarComponent } from 'src/app/components/topbar/topbar.component'
import { FooterComponent } from '../components/footer/footer.component'

@NgModule({
  declarations: [LayoutComponent],
  imports: [
    CommonModule,
    RouterModule,
    DesignAngularKitModule,

    // standalone
    TopbarComponent,
    FooterComponent,
  ],
  exports: [LayoutComponent],
})
export class LayoutModule {}
