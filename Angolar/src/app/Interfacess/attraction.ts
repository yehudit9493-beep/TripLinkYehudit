export interface Attraction {
  attractionId: number;
  attractionName: string;
  areaId: number;
  address: string;
  typeName: string;
  sabbathKeeper: boolean;
  entryFee: number;
  openingHours: string;
  phoneNumber: string;
  description: string;
  suitableForKids: boolean;
  images?: string[];
  city: string;
}
export type AttractionWithoutId = Omit<Attraction, 'attractionId'>;