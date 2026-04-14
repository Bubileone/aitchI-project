export interface Movement {
  id: string;
  itemId: string;
  fromLocationId: string;
  toLocationId: string;
  note: string;
  movedAt: Date;
}
