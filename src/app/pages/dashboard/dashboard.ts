import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { LocationService } from '../../services/location';
import { ItemService } from '../../services/item';
import { MovementService } from '../../services/movement';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  constructor(
    protected locationService: LocationService,
    protected itemService: ItemService,
    protected movementService: MovementService,
  ) {}

  getLocationName(locationId: string): string {
    return this.locationService.getById(locationId)?.name ?? 'Unknown';
  }

  getItemName(itemId: string): string {
    return this.itemService.getById(itemId)?.name ?? 'Deleted item';
  }
}
