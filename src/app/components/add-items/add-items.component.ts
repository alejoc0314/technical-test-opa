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

  /**
   * Limpia el valor de entrada para asegurarse de que solo contenga números positivos.
   * Si el valor no es válido, lo establece en vacío.
   */
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

  /**
   * Agrega un nuevo ítem a la lista de items si los valores ingresados son válidos.
   * Después de agregar el ítem, guarda los cambios y restablece el formulario.
   */
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

  /**
   * Restablece los valores del formulario a su estado inicial.
   */
  resetForm() {
    this.name = '';
    this.weight = 0;
    this.calories = 0;
  }

  /**
   * Determina si el botón para agregar ítems debe estar deshabilitado
   * basado en la validez de los valores ingresados en el formulario.
   */
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
