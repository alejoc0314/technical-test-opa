import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemsListComponent } from './items-list.component';
import { ItemsService } from '../../services/items.service';
import { ItemCardComponent } from '../item-card/item-card.component';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Item } from '../../models/items.interface';

describe('ItemsListComponent', () => {
  let component: ItemsListComponent;
  let fixture: ComponentFixture<ItemsListComponent>;
  let itemsService: jasmine.SpyObj<ItemsService>;

  const mockItems: Item[] = [
    { id: 1, name: 'Item 1', weight: 3, calories: 5 },
    { id: 2, name: 'Item 2', weight: 2, calories: 6 },
  ];

  beforeEach(async () => {
    const itemsServiceSpy = jasmine.createSpyObj('ItemsService', [
      'calculateOptimalItems',
    ]);

    await TestBed.configureTestingModule({
      imports: [ItemsListComponent, CommonModule, ItemCardComponent],
      providers: [{ provide: ItemsService, useValue: itemsServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemsListComponent);
    component = fixture.componentInstance;
    itemsService = TestBed.inject(ItemsService) as jasmine.SpyObj<ItemsService>;

    // Use setInput to simulate Input Signals
    fixture.componentRef.setInput('itemList', mockItems);
    fixture.componentRef.setInput('isCalculated', false);

    fixture.detectChanges(); // Render the component
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title "Provisiones Agregadas" when isCalculated is false', () => {
    fixture.componentRef.setInput('isCalculated', false);
    fixture.detectChanges();

    const title = fixture.debugElement.query(By.css('h2')).nativeElement;
    expect(title.textContent).toContain('Provisiones Agregadas');
  });

  it('should display the title "Mejor Conjunto" when isCalculated is true', () => {
    fixture.componentRef.setInput('isCalculated', true);
    fixture.detectChanges();

    const title = fixture.debugElement.query(By.css('h2')).nativeElement;
    expect(title.textContent).toContain('Mejor Conjunto');
  });

  it('should render the correct number of items in the list', () => {
    fixture.componentRef.setInput('itemList', mockItems);
    fixture.detectChanges();

    const itemCards = fixture.debugElement.queryAll(By.css('app-item-card'));
    expect(itemCards.length).toBe(mockItems.length);
  });

  it('should display the warning message when isCalculated is false', () => {
    fixture.componentRef.setInput('isCalculated', false);
    fixture.detectChanges();

    const warning = fixture.debugElement.query(By.css('span')).nativeElement;
    expect(warning.textContent).toContain('el mínimo de calorías debe ser 15');
  });

  it('should NOT display the warning message when isCalculated is true', () => {
    fixture.componentRef.setInput('isCalculated', true);
    fixture.detectChanges();

    const warning = fixture.debugElement.query(By.css('span'));
    expect(warning).toBeNull();
  });

  it('should call the calculateOptimalItems method of the service when the button is clicked', () => {
    fixture.componentRef.setInput('isCalculated', false);
    fixture.detectChanges();

    const button = fixture.debugElement.query(
      By.css('#calculate-items')
    ).nativeElement;
    button.click();

    expect(itemsService.calculateOptimalItems).toHaveBeenCalled();
  });
});
