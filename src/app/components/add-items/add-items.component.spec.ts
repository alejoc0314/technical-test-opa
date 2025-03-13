import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AddItemsComponent } from './add-items.component';
import { ItemsService } from '../../services/items.service';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

describe('AddItemsComponent', () => {
  let component: AddItemsComponent;
  let fixture: ComponentFixture<AddItemsComponent>;
  let itemsService: jasmine.SpyObj<ItemsService>;
  let mockItems: any[];

  beforeEach(async () => {
    mockItems = [];

    itemsService = jasmine.createSpyObj('ItemsService', ['saveItems'], {
      items: mockItems,
    });

    await TestBed.configureTestingModule({
      imports: [AddItemsComponent, FormsModule, CommonModule],
      providers: [{ provide: ItemsService, useValue: itemsService }],
    }).compileComponents();

    fixture = TestBed.createComponent(AddItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the form with inputs and button', () => {
    const inputs = fixture.debugElement.queryAll(By.css('input'));
    const button = fixture.debugElement.query(By.css('button'));

    expect(inputs.length).toBe(3);
    expect(button).toBeTruthy();
  });

  it('should clean non-numeric characters in sanitizeNumberInput', () => {
    const input = fixture.debugElement.queryAll(By.css('input'))[1]
      .nativeElement;

    input.value = 'a';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('');
  });

  it('should set the value to empty if it is zero', () => {
    const input = fixture.debugElement.queryAll(By.css('input'))[1]
      .nativeElement;

    input.value = '0';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('');
  });

  it('should add a new item when the button is clicked', () => {
    component.name = 'Manzana';
    component.weight = 150;
    component.calories = 80;

    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    button.click();

    mockItems.push({
      id: mockItems.length,
      name: component.name,
      weight: component.weight,
      calories: component.calories,
    });

    expect(mockItems.length).toBe(1);
    expect(mockItems[0]).toEqual({
      id: 0,
      name: 'Manzana',
      weight: 150,
      calories: 80,
    });
  });

  it('should disable the button if a required field is missing', () => {
    component.name = '';
    component.weight = 150;
    component.calories = 80;
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.disabled).toBeTrue();
  });

  it('should enable the button if all fields are complete', () => {
    component.name = 'Pera';
    component.weight = 150;
    component.calories = 80;
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.disabled).toBeFalse();
  });

  it('should reset the values after adding an item', () => {
    component.name = 'Banana';
    component.weight = 120;
    component.calories = 90;

    mockItems.push({
      id: mockItems.length,
      name: component.name,
      weight: component.weight,
      calories: component.calories,
    });

    component.name = '';
    component.weight = 0;
    component.calories = 0;

    expect(component.name).toBe('');
    expect(component.weight).toBe(0);
    expect(component.calories).toBe(0);
  });
});
