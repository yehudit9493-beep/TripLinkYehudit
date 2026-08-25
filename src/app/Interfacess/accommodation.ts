export interface Accommodation {
  id: number;
  name: string;
  regionId: number;
  address: string;
  description: string;
  numberOfRooms: number;
  numberOfBeds: number;
  pricePerNight: number;
  phoneNumber: string;
  images?: string[];
  Auditorium?: boolean;
  Kashrut?: string;
  city : string
}

export type AccommodationWithoutId = Omit<Accommodation, 'id'>;
