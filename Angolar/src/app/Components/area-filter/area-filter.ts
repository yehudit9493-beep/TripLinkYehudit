import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDrawer, MatDrawerContainer, MatDrawerContent, MatSidenavModule } from '@angular/material/sidenav';
import { Regions } from '../../Service/regions';
import { AttractionService } from '../../Service/attraction-service';
import { HotelService } from '../../Service/hotel-service';
import { GuideService } from '../../Service/guide-service';
import { TrailsService } from '../../Service/TrailsService';
import { Attraction } from '../../Interfacess/attraction';
import { Accommodation } from '../../Interfacess/accommodation';
import { Guides } from '../../Interfacess/guides';
import { Trail } from '../../Interfacess/Trail';
import { Subscription } from 'rxjs';

// סוגי הפריטים המופיעים במסך
export type FilterEntityType = 'attraction' | 'accommodation' | 'guide' | 'trail';

// פריט מאוחד לשורת רשימה
export interface AreaFilterItem {
  type: FilterEntityType;
  typeLabel: string;   // תווית בעברית (למשל 🏛️ אטרקציה)
  id: number;
  name: string;
  regions: string[];   // שמות האזורים (למדריכים זה מערך)
  detail: string;      // שורת מידע קצר
  payload: any;        // האובייקט המקורי להצגה בפרטים
}

@Component({
  selector: 'app-area-filter',
  imports: [CommonModule, FormsModule, MatSidenavModule],
  templateUrl: './area-filter.html',
  styleUrl: './area-filter.scss',
  standalone: true,
})
export class AreaFilter implements OnInit, OnDestroy {

  // אייקון "פרטים" (info) המוצג בכל שורת רשימה
  infoIconSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
      <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14m0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16"/>
      <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588M9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
    </svg>`;

  // ===== drawer (PUSH) — נפתח שמקליקים על אייקון הפרטים =====
  @ViewChild('detailsDrawer') drawer?: MatDrawer;

  // הפריט שנבחר להצגת פרטים ב-drawer
  selectedItem: AreaFilterItem | null = null;

  // ===== אזורים =====
  private readonly regions = inject(Regions);
  areaList: string[] = [];

  // האזורים שנבחרו בתיבות הסימון
  selectedAreas: string[] = [];

  // ===== נתונים =====
  private readonly attractionService = inject(AttractionService);
  private readonly hotelService = inject(HotelService);
  private readonly guideService = inject(GuideService);
  private readonly trailsService = inject(TrailsService);

  private allAttractions: Attraction[] = [];
  private allAccommodations: Accommodation[] = [];
  private allGuides: Guides[] = [];
  private allTrails: Trail[] = [];

  private subs: Subscription[] = [];

  isLoading = true;
  loadError = '';

  // סוגי הקבוצות אליהן מוקצה כל אזור (לספירת תוצאות)
  private areaCounts = new Map<string, { attraction: number; accommodation: number; guide: number; trail: number }>();

  ngOnInit(): void {
    this.areaList = this.regions.getAllAreas().map((a) => a.name);

    // אתחול המונה של כל אזור
    this.areaList.forEach((name) =>
      this.areaCounts.set(name, { attraction: 0, accommodation: 0, guide: 0, trail: 0 })
    );

    // טעינת כל קבוצות הנתונים במקביל
    this.subs.push(
      this.attractionService.GetAttraction().subscribe({
        next: (data) => { this.allAttractions = data; this.onGroupLoaded(); },
        error: () => this.onGroupFailed('אטרקציות'),
      })
    );
    this.subs.push(
      this.hotelService.GetTrail().subscribe({
        next: (data) => { this.allAccommodations = data; this.onGroupLoaded(); },
        error: () => this.onGroupFailed('מקומות אירוח'),
      })
    );
    this.subs.push(
      this.guideService.GetGuide().subscribe({
        next: (data) => { this.allGuides = data; this.onGroupLoaded(); },
        error: () => this.onGroupFailed('מדריך'),
      })
    );
    this.subs.push(
      this.trailsService.GetTrail().subscribe({
        next: (data) => { this.allTrails = data; this.onGroupLoaded(); },
        error: () => this.onGroupFailed('מסלולים'),
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  private readonly TOTAL_GROUPS = 4;
  private loadedGroups = 0;
  private failedGroups = 0;

  private onGroupLoaded(): void {
    this.loadedGroups++;
    if (this.loadedGroups + this.failedGroups >= this.TOTAL_GROUPS && this.loadedGroups > 0) {
      this.isLoading = false;
      this.computeAreaCounts();
    }
  }

  private onGroupFailed(name: string): void {
    this.failedGroups++;
    this.loadError = this.loadError ? `${this.loadError}, ${name}` : `לא הצלחנו לטעון: ${name}`;
    this.onGroupLoaded();
  }

  // ספירת כמה פריטים מכל סוג יש בכל אזור
  private computeAreaCounts(): void {
    for (const a of this.allAttractions) {
      const c = this.areaCounts.get(this.getAreaName(a.areaId));
      if (c) c.attraction++;
    }
    for (const h of this.allAccommodations) {
      const c = this.areaCounts.get(this.getAreaName(h.regionId));
      if (c) c.accommodation++;
    }
    for (const g of this.allGuides) {
      for (const rid of g.trainingRegionsId || []) {
        const c = this.areaCounts.get(this.getAreaName(rid));
        if (c) c.guide++;
      }
    }
    for (const t of this.allTrails) {
      const c = this.areaCounts.get(this.getAreaName(t.regionId));
      if (c) c.trail++;
    }
  }

  getAreaName(id: number): string {
    return this.regions.getAreasById(id);
  }

  // ===== סינון =====
  private belongsToSelected(names: string[]): boolean {
    if (this.selectedAreas.length === 0) return true; // לא נבחר כלום — מציג הכל
    return names.some((n) => this.selectedAreas.includes(n));
  }

  applyFilter(): void {
    // כבר אין צורך לעבד — משתמשים בטוען המסונן
  }

  toggleArea(name: string, checked: boolean): void {
    if (checked) {
      if (!this.selectedAreas.includes(name)) this.selectedAreas.push(name);
    } else {
      this.selectedAreas = this.selectedAreas.filter((a) => a !== name);
    }
  }

  selectAll(checked: boolean): void {
    this.selectedAreas = checked ? [...this.areaList] : [];
  }

  clearFilters(): void {
    this.selectedAreas = [];
  }

  isAreaSelected(name: string): boolean {
    return this.selectedAreas.includes(name);
  }

  // ===== רשימות מסוננות לפי האזורים שנבחרו =====
  get filteredAttractions(): Attraction[] {
    return this.allAttractions.filter((a) =>
      this.belongsToSelected([this.getAreaName(a.areaId)])
    );
  }

  get filteredAccommodations(): Accommodation[] {
    return this.allAccommodations.filter((h) =>
      this.belongsToSelected([this.getAreaName(h.regionId)])
    );
  }

  get filteredGuides(): Guides[] {
    return this.allGuides.filter((g) =>
      this.belongsToSelected((g.trainingRegionsId || []).map((id) => this.getAreaName(id)))
    );
  }

  get filteredTrails(): Trail[] {
    return this.allTrails.filter((t) =>
      this.belongsToSelected([this.getAreaName(t.regionId)])
    );
  }

  get totalVisible(): number {
    return this.filteredAttractions.length + this.filteredAccommodations.length +
      this.filteredGuides.length + this.filteredTrails.length;
  }

  areaBadge(area: string): string {
    const c = this.areaCounts.get(area);
    if (!c) return '';
    const total = c.attraction + c.accommodation + c.guide + c.trail;
    return total > 0 ? `${total} פריטים` : '';
  }

  // ===== פתיחת פרטים ב-drawer (PUSH) =====
  showDetails(item: AreaFilterItem): void {
    this.selectedItem = item;
    this.drawer?.open();
  }

  closeDrawer(): void {
    this.drawer?.close();
    this.selectedItem = null;
  }

  // ===== בניית פריט הצגה =====
  private buildItem(type: FilterEntityType, typeLabel: string, id: number, name: string, regions: string[], detail: string, payload: any): AreaFilterItem {
    return { type, typeLabel, id, name, regions, detail, payload };
  }

  attractionItem(a: Attraction): AreaFilterItem {
    return this.buildItem(
      'attraction', '🏛️ אטרקציה', a.attractionId, a.attractionName,
      [this.getAreaName(a.areaId)],
      [a.city, a.entryFee ? `${a.entryFee} ₪` : ''].filter(Boolean).join(' • '),
      a
    );
  }

  accommodationItem(h: Accommodation): AreaFilterItem {
    return this.buildItem(
      'accommodation', '🏨 מקום אירוח', h.id, h.name,
      [this.getAreaName(h.regionId)],
      [h.city, h.pricePerNight ? `${h.pricePerNight} ₪ ללילה` : ''].filter(Boolean).join(' • '),
      h
    );
  }

  guideItem(g: Guides): AreaFilterItem {
    return this.buildItem(
      'guide', '🧭 מדריכה', g.id, g.name,
      (g.trainingRegionsId || []).map((id) => this.getAreaName(id)),
      [g.specialization, g.yearsOfExperience ? `${g.yearsOfExperience} שנות ניסיון` : ''].filter(Boolean).join(' • '),
      g
    );
  }

  trailItem(t: Trail): AreaFilterItem {
    return this.buildItem(
      'trail', '🥾 מסלול', t.id, t.name,
      [this.getAreaName(t.regionId)],
      [t.RouteLengthInKM ? `${t.RouteLengthInKM} ק"מ` : '', t.RouteDuration].filter(Boolean).join(' • '),
      t
    );
  }
}
