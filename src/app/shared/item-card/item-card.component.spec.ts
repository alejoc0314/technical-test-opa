import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemCardComponent } from './item-card.component';
import { ItemsService } from './../../services/items.service';
import { Item } from '../../models/items.interface';
import { By } from '@angular/platform-browser';

describe('ItemCardComponent', () => {
  let component: ItemCardComponent;
  let fixture: ComponentFixture<ItemCardComponent>;
  let mockItemsService: jasmine.SpyObj<ItemsService>;

  const mockItem: Item = {
    id: 1,
    name: 'Manzana',
    weight: 200,
    calories: 100,
  };

  beforeEach(async () => {
    mockItemsService = jasmine.createSpyObj('ItemsService', ['deleteItem']);

    await TestBed.configureTestingModule({
      imports: [ItemCardComponent],
      providers: [{ provide: ItemsService, useValue: mockItemsService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemCardComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('itemProperties', mockItem);
    fixture.componentRef.setInput('isLast', false);
    fixture.componentRef.setInput('isBestCombination', false);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display item properties correctly', () => {
    const nameElement = fixture.debugElement.query(
      By.css('#item-name')
    ).nativeElement;
    const weightElement = fixture.debugElement.query(
      By.css('#item-weight')
    ).nativeElement;
    const caloriesElement = fixture.debugElement.query(
      By.css('#item-calories')
    ).nativeElement;

    expect(nameElement.textContent.trim()).toBe('Manzana');
    expect(weightElement.textContent.trim()).toBe('Peso: 200');
    expect(caloriesElement.textContent.trim()).toBe('Calorías: 100');
  });

  it('should apply "mb-2" class when isLast is false', () => {
    // Actualizar la Input Signal usando setInput
    fixture.componentRef.setInput('isLast', false);
    fixture.detectChanges();

    const containerElement = fixture.debugElement.query(
      By.css('div.flex.w-full')
    );
    expect(containerElement.classes['mb-2']).toBeTrue();
  });

  it('should not apply "mb-2" class when isLast is true', () => {
    // Actualizar la Input Signal usando setInput
    fixture.componentRef.setInput('isLast', true);
    fixture.detectChanges();

    const containerElement = fixture.debugElement.query(
      By.css('div.flex.w-full')
    );
    expect(containerElement?.classes['mb-2']).toBeFalsy();
  });

  it('should call deleteItem when delete button is clicked', () => {
    const deleteButton = fixture.debugElement.query(
      By.css('button')
    ).nativeElement;
    deleteButton.click();

    expect(mockItemsService.deleteItem).toHaveBeenCalledWith(
      mockItem.id,
      false
    );
  });

  it('should call deleteItem with isBestCombination as true', () => {
    // Actualizar la Input Signal usando setInput
    fixture.componentRef.setInput('isBestCombination', true);
    fixture.detectChanges();

    const deleteButton = fixture.debugElement.query(
      By.css('button')
    ).nativeElement;
    deleteButton.click();

    expect(mockItemsService.deleteItem).toHaveBeenCalledWith(mockItem.id, true);
  });
});
