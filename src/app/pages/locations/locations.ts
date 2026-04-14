import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LocationService } from '../../services/location';
import { ItemService } from '../../services/item';
import { Location } from '../../models/location.model';

@Component({
  selector: 'app-locations',
  imports: [FormsModule],
  templateUrl: './locations.html',
  styleUrl: './locations.css',
})
export class Locations {
  showForm = signal(false);
  editingLocation = signal<Location | null>(null);

  name = '';
  description = '';

  constructor(
    protected locationService: LocationService,
    protected itemService: ItemService,
  ) {}

  openAddForm(): void {
    this.editingLocation.set(null);
    this.name = '';
    this.description = '';
    this.showForm.set(true);
  }

  openEditForm(location: Location): void {
    this.editingLocation.set(location);
    this.name = location.name;
    this.description = location.description;
    this.showForm.set(true);
  }

  save(): void {
    if (!this.name.trim()) return;

    const editing = this.editingLocation();
    if (editing) {
      this.locationService.update(editing.id, this.name.trim(), this.description.trim());
    } else {
      this.locationService.add(this.name.trim(), this.description.trim());
    }
    this.cancel();
  }

  cancel(): void {
    this.showForm.set(false);
    this.editingLocation.set(null);
    this.name = '';
    this.description = '';
  }

  deleteLocation(id: string): void {
    if (confirm('Are you sure you want to delete this location?')) {
      this.locationService.delete(id);
    }
  }

  getItemCount(locationId: string): number {
    return this.itemService.getByLocation(locationId).length;
  }
}
