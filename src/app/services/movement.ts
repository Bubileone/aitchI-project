import { Injectable, inject, signal } from '@angular/core';
import { StorageService } from './storage';
import { ItemService } from './item';
import { Movement } from '../models/movement.model';

const STORAGE_KEY = 'aitchi_movements';

@Injectable({
  providedIn: 'root',
})
export class MovementService {
  private storage = inject(StorageService);
  private itemService = inject(ItemService);
  private movementsSignal = signal<Movement[]>(this.loadMovements());

  readonly movements = this.movementsSignal.asReadonly();

  private loadMovements(): Movement[] {
    return this.storage.get<Movement>(STORAGE_KEY);
  }

  private save(): void {
    this.storage.set(STORAGE_KEY, this.movementsSignal());
  }

  getByItem(itemId: string): Movement[] {
    return this.movementsSignal().filter(m => m.itemId === itemId);
  }

  moveItem(itemId: string, fromLocationId: string, toLocationId: string, note: string): void {
    const movement: Movement = {
      id: this.storage.generateId(),
      itemId,
      fromLocationId,
      toLocationId,
      note,
      movedAt: new Date(),
    };
    this.movementsSignal.update(movements => [movement, ...movements]);
    this.save();

    // Also update the item's current location
    this.itemService.moveItem(itemId, toLocationId);
  }
}
