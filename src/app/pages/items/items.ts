import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ItemService } from '../../services/item';
import { LocationService } from '../../services/location';
import { Item } from '../../models/item.model';

@Component({
  selector: 'app-items',
  imports: [FormsModule],
  templateUrl: './items.html',
  styleUrl: './items.css',
})
export class Items {
  showForm = signal(false);
  editingItem = signal<Item | null>(null);
  searchQuery = signal('');
  filterLocation = signal('');

  name = '';
  category = '';
  locationId = '';
  description = '';

  constructor(
    protected itemService: ItemService,
    protected locationService: LocationService,
  ) {}

  readonly filteredItems = computed(() => {
    let items = this.itemService.items();
    const query = this.searchQuery().toLowerCase();
    const locFilter = this.filterLocation();

    if (query) {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query),
      );
    }

    if (locFilter) {
      items = items.filter((item) => item.locationId === locFilter);
    }

    return items;
  });

  getLocationName(locationId: string): string {
    return this.locationService.getById(locationId)?.name ?? 'Unknown';
  }

  openAddForm(): void {
    this.editingItem.set(null);
    this.name = '';
    this.category = '';
    this.locationId = '';
    this.description = '';
    this.showForm.set(true);
  }

  openEditForm(item: Item): void {
    this.editingItem.set(item);
    this.name = item.name;
    this.category = item.category;
    this.locationId = item.locationId;
    this.description = item.description;
    this.showForm.set(true);
  }

  save(): void {
    if (!this.name.trim() || !this.locationId) return;

    const editing = this.editingItem();
    if (editing) {
      this.itemService.update(
        editing.id,
        this.name.trim(),
        this.category.trim(),
        this.locationId,
        this.description.trim(),
      );
    } else {
      this.itemService.add(
        this.name.trim(),
        this.category.trim(),
        this.locationId,
        this.description.trim(),
      );
    }
    this.cancel();
  }

  cancel(): void {
    this.showForm.set(false);
    this.editingItem.set(null);
    this.name = '';
    this.category = '';
    this.locationId = '';
    this.description = '';
  }

  deleteItem(id: string): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.itemService.delete(id);
    }
  }

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  onFilterChange(value: string): void {
    this.filterLocation.set(value);
  }
}
