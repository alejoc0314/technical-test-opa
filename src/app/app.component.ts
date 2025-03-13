import { ItemsService } from './services/items.service';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddItemsComponent } from './components/add-items/add-items.component';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ItemsListComponent } from './shared/items-list/items-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, AddItemsComponent, ItemsListComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('visible', style({ opacity: 1, visibility: 'visible' })),
      state('hidden', style({ opacity: 0, visibility: 'hidden' })),
      transition('visible <=> hidden', animate('300ms ease-in-out')),
    ]),
    trigger('slideInOut', [
      state('in', style({ width: '0', overflow: 'hidden' })),
      state('out', style({ width: '33.33%', overflow: 'hidden' })),
      transition('in <=> out', animate('300ms ease-in-out')),
    ]),
  ],
})
export class AppComponent {
  protected readonly itemsService = inject(ItemsService);
}
