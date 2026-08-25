import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { FavoriteItem, FavoriteService } from '../../Service/favorite-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorites-panel',
  imports: [CommonModule],
  templateUrl: './favorites-panel.html',
  styleUrl: './favorites-panel.scss',
  standalone: true
})
export class FavoritesPanel {

  @Output() closed = new EventEmitter<void>();

  constructor(
    public favoritesService: FavoriteService,
    private router: Router,
    private elementRef: ElementRef
  ) { }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closed.emit();
    }
  }

  get favorites(): FavoriteItem[] {
    return this.favoritesService.getFavorites();
  }

  removeFavorite(item: FavoriteItem) {
    this.favoritesService.removeFavorite(item);
  }

  getTypeLabel(type: string): string {
    const labels: any = {
      guides: 'מדריכה',
      Trail: 'מסלול',
      attraction: 'אטרקציה',
      accommodation: 'לינה'
    };
    return labels[type] || type;
  }

  getTypeIcon(type: string): string {
    const icons: any = {
      guides: '🧭',
      Trail: '🥾',
      attraction: '🏛️',
      accommodation: '🏨'
    };
    return icons[type] || '⭐';
  }

  getName(item: FavoriteItem): string {
    return item.data.name || item.data.title || 'ללא שם';
  }

  onItemClick(item: FavoriteItem) {
    if (item.type === 'guides') {
      this.closed.emit();

      if (this.router.url === '/guide') {
        // ⬅️ כבר בדף המדריכות — שולחים ישירות דרך Subject
        this.favoritesService.openGuide$.next(item.data);
      } else {
        // ⬅️ בדף אחר — שומרים ומנווטים
        this.favoritesService.pendingGuide = item.data;
        this.router.navigate(['/guide']);
      }
    }

    if (item.type === 'Trail') {
      this.closed.emit();
      if (this.router.url === '/trails') {
        this.favoritesService.openTrail$.next(item.data);
      } else {
        this.favoritesService.pendingTrail = item.data;
        this.router.navigate(['/trails']);
      }
    }

    if (item.type === 'attraction') {
      this.closed.emit();
      if (this.router.url === '/attractions') {
        this.favoritesService.openAttraction$.next(item.data);
      } else {
        this.favoritesService.pendingAttraction = item.data;
        this.router.navigate(['/attractions']);
      }
    }

    if (item.type === 'accommodation') {
      this.closed.emit();
      if (this.router.url === '/hotels') {
        this.favoritesService.openAccommodation$.next(item.data);
      } else {
        this.favoritesService.pendingAccommodation = item.data;
        this.router.navigate(['/hotels']);
      }
    }

  }
}