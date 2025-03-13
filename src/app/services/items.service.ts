import { Injectable } from '@angular/core';
import { Item } from '../models/items.interface';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  items: Item[] = [];
  optimalItems: Item[] = [];

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

    if (this.optimalItems.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Sin combinación posible',
        text: 'No se encontró una combinación que cumpla con las restricciones de peso y calorías.',
        confirmButtonText: 'Entendido',
      });
    }
  };

  deleteItem(id: number, fromAllItems: boolean): void {
    if (fromAllItems) {
      this.items = this.items.filter((item) => item.id !== id);
      this.optimalItems = this.optimalItems.filter((item) => item.id !== id);
    } else {
      this.optimalItems = this.optimalItems.filter((item) => item.id !== id);
    }
  }
}
