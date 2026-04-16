import { Injectable, inject, signal, computed } from '@angular/core';
import { StorageService } from './storage';
import { Location } from '../models/location.model';

const STORAGE_KEY = 'aitchi_locations';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private storage = inject(StorageService);
  private locationsSignal = signal<Location[]>(this.loadLocations());

  readonly locations = this.locationsSignal.asReadonly();

  readonly locationCount = computed(() => this.locationsSignal().length);

  private loadLocations(): Location[] {
    return this.storage.get<Location>(STORAGE_KEY);
  }

  private save(): void {
    this.storage.set(STORAGE_KEY, this.locationsSignal());
  }

  getById(id: string): Location | undefined {
    return this.locationsSignal().find(l => l.id === id);
  }

  add(name: string, description: string): void {
    const location: Location = {
      id: this.storage.generateId(),
      name,
      description,
      createdAt: new Date(),
    };
    this.locationsSignal.update(locations => [...locations, location]);
    this.save();
  }

  update(id: string, name: string, description: string): void {
    this.locationsSignal.update(locations =>
      locations.map(l => l.id === id ? { ...l, name, description } : l)
    );
    this.save();
  }

  delete(id: string): void {
    this.locationsSignal.update(locations => locations.filter(l => l.id !== id));
    this.save();
  }
}
