export interface Trail {
    id: number;
    name: string;
    describshain: string;
    regionId: number;
    directions: string;
    RouteLengthInKM: number;
    RouteDuration: string;
    DifficultyLevel: string;
    minimumAge: number;
    MaximumAge: number;
    WetDryTrack: string;
    season: string[];
    images?: string[];
}

export type TrailWithoutId = Omit<Trail, 'id'>;