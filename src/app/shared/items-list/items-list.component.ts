import { ItemsService } from '../../services/items.service';
import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemCardComponent } from '../item-card/item-card.component';
import { Item } from '../../models/items.interface';

@Component({
  selector: 'app-items-list',
  standalone: true,
  imports: [CommonModule, ItemCardComponent],
  templateUrl: './items-list.component.html',
  styleUrl: './items-list.component.scss',
})
export class ItemsListComponent {
  protected readonly itemsService = inject(ItemsService);

  public itemList = input.required<Item[]>();
  public isCalculated = input.required<boolean>();

  calculateItems() {
    this.itemsService.calculateOptimalItems();
  }
}
