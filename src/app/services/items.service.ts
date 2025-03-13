import { Injectable } from '@angular/core';
import { Item } from '../models/items.interface';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  items: Item[] = [];
  optimalItems: Item[] = [];

  constructor() {
    // Cargar datos almacenados al inicializar el servicio
    this.loadItems();
  }

  /**
   * Guarda la lista de ítems y la combinación óptima en el almacenamiento local.
   */
  public saveItems(): void {
    localStorage.setItem('items', JSON.stringify(this.items));
    localStorage.setItem('optimalItems', JSON.stringify(this.optimalItems));
  }

  /**
   * Carga la lista de ítems y la combinación óptima desde el almacenamiento local.
   */
  public loadItems(): void {
    const storedItems = localStorage.getItem('items');
    const storedOptimalItems = localStorage.getItem('optimalItems');

    if (storedItems) {
      this.items = JSON.parse(storedItems);
    }
    if (storedOptimalItems) {
      this.optimalItems = JSON.parse(storedOptimalItems);
    }
  }

  /**
   * Calcula la combinación óptima de ítems que cumple con las restricciones de peso y calorías.
   * La combinación debe tener al menos 15 calorías y no superar los 10 de peso.
   * Si hay varias combinaciones posibles, selecciona la que tenga el menor peso
   * o, en caso de empate, la de mayor valor calórico.
   */
  calculateOptimalItems = (): void => {
    let bestCombination: Item[] = [];
    let bestWeight = Infinity;
    let bestCalories = 0;

    const backtrack = (
      index: number,
      currentCombination: Item[],
      currentWeight: number,
      currentCalories: number
    ) => {
      if (currentCalories >= 15 && currentWeight <= 10) {
        if (
          currentWeight < bestWeight ||
          (currentWeight === bestWeight && currentCalories > bestCalories)
        ) {
          bestCombination = [...currentCombination];
          bestWeight = currentWeight;
          bestCalories = currentCalories;
        }
      }

      if (currentWeight >= 10) {
        return;
      }

      for (let i = index; i < this.items.length; i++) {
        if (currentWeight + this.items[i].weight <= 10) {
          currentCombination.push(this.items[i]);
          backtrack(
            i + 1,
            currentCombination,
            currentWeight + this.items[i].weight,
            currentCalories + this.items[i].calories
          );
          currentCombination.pop();
        }
      }
    };

    backtrack(0, [], 0, 0);

    this.optimalItems = bestCombination;

    this.saveItems();

    if (this.optimalItems.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Sin combinación posible',
        text: 'No se encontró una combinación que cumpla con las restricciones de peso y calorías.',
        confirmButtonText: 'Entendido',
      });
    }
  };

  /**
   * Elimina un ítem por su ID, ya sea de la lista de todos los ítems
   * o solo de la lista de combinación óptima.
   * @param id - ID del ítem a eliminar.
   * @param fromAllItems - Si es `true`, elimina el ítem de ambas listas.
   */
  deleteItem(id: number, fromAllItems: boolean): void {
    if (fromAllItems) {
      this.items = this.items.filter((item) => item.id !== id);
      this.optimalItems = this.optimalItems.filter((item) => item.id !== id);
    } else {
      this.optimalItems = this.optimalItems.filter((item) => item.id !== id);
    }

    this.saveItems();
  }
}
