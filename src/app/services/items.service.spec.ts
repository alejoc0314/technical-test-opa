import { TestBed } from '@angular/core/testing';
import { ItemsService } from './items.service';
import { Item } from '../models/items.interface';
import Swal from 'sweetalert2';

describe('ItemsService', () => {
  let service: ItemsService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadItems', () => {
    it('should load items from localStorage', () => {
      const mockItems = [
        { id: 1, name: 'Item 1', weight: 2, calories: 10 },
        { id: 2, name: 'Item 2', weight: 3, calories: 15 },
      ];

      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockItems));

      service.loadItems();

      expect(service.items.length).toBe(2);
      expect(service.items[0]).toEqual(mockItems[0]);
      expect(service.items[1]).toEqual(mockItems[1]);
    });

    it('should handle empty localStorage', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);

      service.loadItems();

      expect(service.items.length).toBe(0);
    });
  });

  describe('calculateOptimalItems', () => {
    beforeEach(() => {
      service.items = [
        { id: 1, name: 'Item 1', weight: 5, calories: 3 },
        { id: 2, name: 'Item 2', weight: 3, calories: 5 },
        { id: 3, name: 'Item 3', weight: 5, calories: 2 },
        { id: 4, name: 'Item 4', weight: 1, calories: 8 },
        { id: 5, name: 'Item 5', weight: 2, calories: 3 },
      ];
    });

    it('should find the best combination of items', () => {
      service.calculateOptimalItems();

      expect(service.optimalItems).toEqual([
        { id: 2, name: 'Item 2', weight: 3, calories: 5 },
        { id: 4, name: 'Item 4', weight: 1, calories: 8 },
        { id: 5, name: 'Item 5', weight: 2, calories: 3 },
      ]);
    });

    it('should save the best combination to localStorage', () => {
      spyOn(localStorage, 'setItem');

      service.calculateOptimalItems();

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'optimalItems',
        JSON.stringify([
          { id: 2, name: 'Item 2', weight: 3, calories: 5 },
          { id: 4, name: 'Item 4', weight: 1, calories: 8 },
          { id: 5, name: 'Item 5', weight: 2, calories: 3 },
        ])
      );
    });

    it('should show a warning when no valid combination is found', () => {
      spyOn(Swal, 'fire');

      service.items = [
        { id: 1, name: 'Item 1', weight: 5, calories: 3 },
        { id: 2, name: 'Item 2', weight: 3, calories: 5 },
      ];

      service.calculateOptimalItems();

      expect(service.optimalItems).toEqual([]);

      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          icon: 'warning',
          title: 'Sin combinación posible',
          text: 'No se encontró una combinación que cumpla con las restricciones de peso y calorías.',
          confirmButtonText: 'Entendido',
        })
      );
    });
  });

  describe('deleteItem', () => {
    beforeEach(() => {
      service.items = [
        { id: 1, name: 'Item 1', weight: 2, calories: 10 },
        { id: 2, name: 'Item 2', weight: 3, calories: 15 },
      ];
      service.optimalItems = [
        { id: 2, name: 'Item 2', weight: 3, calories: 15 },
      ];
    });

    it('should delete an item from all items and optimal items', () => {
      spyOn(localStorage, 'setItem');

      service.deleteItem(2, true);

      expect(service.items).toEqual([
        { id: 1, name: 'Item 1', weight: 2, calories: 10 },
      ]);
      expect(service.optimalItems).toEqual([]);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'items',
        JSON.stringify([{ id: 1, name: 'Item 1', weight: 2, calories: 10 }])
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'optimalItems',
        JSON.stringify([])
      );
    });

    it('should delete an item only from optimal items', () => {
      spyOn(localStorage, 'setItem');

      service.deleteItem(2, false);

      expect(service.items).toEqual([
        { id: 1, name: 'Item 1', weight: 2, calories: 10 },
        { id: 2, name: 'Item 2', weight: 3, calories: 15 },
      ]);
      expect(service.optimalItems).toEqual([]);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'optimalItems',
        JSON.stringify([])
      );
    });

    it('should save state after deletion', () => {
      spyOn(localStorage, 'setItem');

      service.deleteItem(2, true);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'items',
        JSON.stringify([{ id: 1, name: 'Item 1', weight: 2, calories: 10 }])
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'optimalItems',
        JSON.stringify([])
      );
    });
  });
});
