export interface Guides {
  id: number;
  name: string;
  trainingRegionsId: number[];
  licenseNumber: string;
  phoneNumber: string;
  email: string;
  specialization: string;
  yearsOfExperience: number;
  status : boolean;
  ReligiousAffiliation : string;
}

export type GuideWithoutId = Omit<Guides, 'id'>;