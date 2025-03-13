import { ItemsService } from './../../services/items.service';
import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Item } from '../../models/items.interface';

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item-card.component.html',
  styleUrl: './item-card.component.scss'
})
export class ItemCardComponent {
  protected readonly itemsService = inject(ItemsService);

  public itemProperties = input.required<Item>();
  public isLast = input.required<boolean>();
  public isBestCombination = input.required<boolean>();
}
