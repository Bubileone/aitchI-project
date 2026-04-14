import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MovementService } from '../../services/movement';
import { ItemService } from '../../services/item';
import { LocationService } from '../../services/location';

@Component({
  selector: 'app-movements',
  imports: [FormsModule, DatePipe],
  templateUrl: './movements.html',
  styleUrl: './movements.css',
})
export class Movements {
  showForm = signal(false);

  selectedItemId = '';
  toLocationId = '';
  note = '';

  constructor(
    protected movementService: MovementService,
    protected itemService: ItemService,
    protected locationService: LocationService,
  ) {}

  getItemName(itemId: string): string {
    return this.itemService.getById(itemId)?.name ?? 'Deleted item';
  }

  getLocationName(locationId: string): string {
    return this.locationService.getById(locationId)?.name ?? 'Deleted location';
  }

  getCurrentLocationId(): string {
    const item = this.itemService.getById(this.selectedItemId);
    return item?.locationId ?? '';
  }

  openForm(): void {
    this.selectedItemId = '';
    this.toLocationId = '';
    this.note = '';
    this.showForm.set(true);
  }

  save(): void {
    if (!this.selectedItemId || !this.toLocationId) return;

    const fromLocationId = this.getCurrentLocationId();
    if (fromLocationId === this.toLocationId) return;

    this.movementService.moveItem(
      this.selectedItemId,
      fromLocationId,
      this.toLocationId,
      this.note.trim(),
    );
    this.cancel();
  }

  cancel(): void {
    this.showForm.set(false);
    this.selectedItemId = '';
    this.toLocationId = '';
    this.note = '';
  }
}
