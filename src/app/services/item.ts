import { Injectable, signal, computed } from '@angular/core';
import { StorageService } from './storage';
import { Item } from '../models/item.model';

const STORAGE_KEY = 'aitchi_items';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private itemsSignal = signal<Item[]>(this.loadItems());

  readonly items = this.itemsSignal.asReadonly();

  readonly itemCount = computed(() => this.itemsSignal().length);

  constructor(private storage: StorageService) {}

  private loadItems(): Item[] {
    return this.storage.get<Item>(STORAGE_KEY);
  }

  private save(): void {
    this.storage.set(STORAGE_KEY, this.itemsSignal());
  }

  getById(id: string): Item | undefined {
    return this.itemsSignal().find(i => i.id === id);
  }

  getByLocation(locationId: string): Item[] {
    return this.itemsSignal().filter(i => i.locationId === locationId);
  }

  add(name: string, category: string, locationId: string, description: string): void {
    const item: Item = {
      id: this.storage.generateId(),
      name,
      category,
      locationId,
      description,
      createdAt: new Date(),
    };
    this.itemsSignal.update(items => [...items, item]);
    this.save();
  }

  update(id: string, name: string, category: string, locationId: string, description: string): void {
    this.itemsSignal.update(items =>
      items.map(i => i.id === id ? { ...i, name, category, locationId, description } : i)
    );
    this.save();
  }

  moveItem(itemId: string, newLocationId: string): void {
    this.itemsSignal.update(items =>
      items.map(i => i.id === itemId ? { ...i, locationId: newLocationId } : i)
    );
    this.save();
  }

  delete(id: string): void {
    this.itemsSignal.update(items => items.filter(i => i.id !== id));
    this.save();
  }
}
