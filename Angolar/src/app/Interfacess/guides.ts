export interface GuideFile {
  fileId: number;
  fileName: string;
  filePath: string;
  kind: 'cv' | 'cert';
}

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
  files?: GuideFile[];
}

export type GuideWithoutId = Omit<Guides, 'id'>;