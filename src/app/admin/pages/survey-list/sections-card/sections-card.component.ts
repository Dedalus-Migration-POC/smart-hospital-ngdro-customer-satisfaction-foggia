import {Component} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {RouterLink} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-sections-card',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatCardHeader,
    MatCardContent,
    RouterLink,
    TranslateModule
  ],
  templateUrl: './sections-card.component.html',
  styleUrl: './sections-card.component.scss'
})
export class SectionsCardComponent {

}
