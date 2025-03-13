import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ItemsService } from '../../services/items.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-items',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-items.component.html',
  styleUrls: ['./add-items.component.scss'],
})
export class AddItemsComponent {
  name: string = '';
  weight: number | null = null;
  calories: number | null = null;

  private readonly itemsService = inject(ItemsService);

  sanitizeNumberInput(event: any): number | null {
    const value = event.target.value;

    if (/[^0-9]/.test(value)) {
      event.target.value = value.replace(/[^0-9]/g, '');
    }

    const numValue = Number(event.target.value);

    if (numValue <= 0) {
      event.target.value = '';
      return null;
    }

    return numValue;
  }

  addItem() {
    if (this.name && this.weight! > 0 && this.calories! > 0) {
      const newItem = {
        id: this.itemsService.items.length,
        name: this.name,
        weight: this.weight!,
        calories: this.calories!,
      };

      this.itemsService.items.push(newItem);
      this.itemsService.saveItems();

      this.resetForm();
    }
  }

  resetForm() {
    this.name = '';
    this.weight = 0;
    this.calories = 0;
  }

  isAddDisabled(): boolean {
    return (
      this.name === '' ||
      this.name === undefined ||
      this.name === null ||
      this.weight === 0 ||
      this.weight === null ||
      this.calories === 0 ||
      this.calories === null
    );
  }
}
