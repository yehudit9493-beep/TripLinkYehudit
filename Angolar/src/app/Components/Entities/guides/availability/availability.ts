import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { eachDayOfInterval, startOfMonth, endOfMonth, isSaturday } from 'date-fns';
import { Guides } from '../../../../Interfacess/guides';
import { RouterLink } from '@angular/router';

type DayStatus = 'neutral' | 'busy' | 'preferred'; // 3 מצבים

interface CalendarDay {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isJewishHoliday: boolean;
  holidayName: string;
  isWeekend: boolean;
  status: DayStatus; 
  matchesFilter: boolean;
}

interface CalendarWeek {
  days: CalendarDay[];
}
@Component({
  selector: 'app-availability',
  imports: [CommonModule, RouterLink],
  templateUrl: './availability.html',
  styleUrl: './availability.scss',
  standalone: true
})
export class Availability {

  
  currentDate: Date = new Date();
  weeks: CalendarWeek[] = [];
  holidays: Map<string, string> = new Map();

  // משתני סינון
  filterType: 'single' | 'range' | 'none' = 'none';
  singleDate: Date | null = null;
  startDate: Date | null = null;
  endDate: Date | null = null;

  // ניהול מצבי ימים
  dayStatuses: Map<string, DayStatus> = new Map();

  // מצב עריכה
  editMode: boolean = false;
  selectedDaysForStatus: Map<string, DayStatus> = new Map();
  currentStatusToApply: DayStatus = 'preferred';

  ngOnInit(): void {
    this.initializeHolidays();
    this.generateCalendar();
  }

  private initializeHolidays(): void {
    const jewishHolidays = [
      { month: 1, day: 15, name: 'פסח' },
      { month: 3, day: 6, name: 'שבועות' },
      { month: 7, day: 1, name: 'ראש השנה' },
      { month: 7, day: 10, name: 'יום כיפור' },
      { month: 7, day: 15, name: 'סוכות' },
      { month: 9, day: 25, name: 'חנוכה' },
      { month: 12, day: 14, name: 'פורים' }
    ];

    jewishHolidays.forEach(holiday => {
      const key = `${holiday.month}-${holiday.day}`;
      this.holidays.set(key, holiday.name);
    });
  }

  private generateCalendar(): void {
    const monthStart = startOfMonth(this.currentDate);
    const monthEnd = endOfMonth(this.currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const firstDayOfWeek = monthStart.getDay();
    const previousMonthDays = [];
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(monthStart);
      date.setDate(date.getDate() - (i + 1));
      previousMonthDays.unshift(date);
    }

    const allDays = [...previousMonthDays, ...days];

    while (allDays.length % 7 !== 0) {
      const date = new Date(monthEnd);
      date.setDate(date.getDate() + (allDays.length % 7 === 0 ? 1 : allDays.length % 7 + 1));
      allDays.push(date);
    }

    this.weeks = [];
    for (let i = 0; i < allDays.length; i += 7) {
      const weekDays = allDays.slice(i, i + 7).map(date => this.createCalendarDay(date));
      this.weeks.push({ days: weekDays });
    }
  }

  private createCalendarDay(date: Date): CalendarDay {
    const isCurrentMonth = date.getMonth() === this.currentDate.getMonth();
    const dayOfMonth = date.getDate();

    // בדוק חג יהודי
    const hebrewDate = this.getHebrewDate(date);
    const key = `${hebrewDate.month}-${hebrewDate.day}`;
    const holidayName = this.holidays.get(key) || '';
    const isJewishHoliday = !!holidayName;

    // בדוק שבת
    const isWeekend = isSaturday(date);

    // קבל את מצב היום
    const dateKey = this.getDateKey(date);
    const status = this.dayStatuses.get(dateKey) || 'neutral';

    // בדוק אם התאריך עומד בסינון
    const matchesFilter = this.checkFilterMatch(date);

    return {
      date,
      dayOfMonth,
      isCurrentMonth,
      isJewishHoliday,
      holidayName,
      isWeekend,
      status,
      matchesFilter
    };
  }

  private checkFilterMatch(date: Date): boolean {
    if (this.filterType === 'none') {
      return true;
    }

    if (this.filterType === 'single' && this.singleDate) {
      return this.isSameDay(date, this.singleDate);
    }

    if (this.filterType === 'range' && this.startDate && this.endDate) {
      return date >= this.startDate && date <= this.endDate;
    }

    return true;
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }

  private getHebrewDate(date: Date): { day: number; month: number; year: number } {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hebrewYear = year + 3760;

    return { day, month, year: hebrewYear };
  }

  private getDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // === סינון ===

  onFilterTypeChange(type: string): void {
    this.filterType = type as 'single' | 'range' | 'none';
    if (this.filterType === 'none') {
      this.clearFilter();
    }
  }

  onSingleDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.singleDate = input.value ? new Date(input.value) : null;
    if (this.singleDate) {
      this.applyFilter();
    }
  }

  onStartDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.startDate = input.value ? new Date(input.value) : null;
  }

  onEndDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.endDate = input.value ? new Date(input.value) : null;
  }

  applyFilter(): void {
    if (this.filterType === 'single' && !this.singleDate) {
      alert('אנא בחר תאריך');
      return;
    }

    if (this.filterType === 'range' && (!this.startDate || !this.endDate)) {
      alert('אנא בחר טווח תאריכים');
      return;
    }

    if (this.filterType === 'range' && this.startDate && this.endDate && this.startDate > this.endDate) {
      alert('תאריך ההתחלה חייב להיות לפני תאריך הסיום');
      return;
    }

    this.generateCalendar();
  }

  clearFilter(): void {
    this.filterType = 'none';
    this.singleDate = null;
    this.startDate = null;
    this.endDate = null;
    this.generateCalendar();
  }

  // === ניהול מצבי ימים ===

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.selectedDaysForStatus.clear();
    }
  }

  toggleDaySelection(day: CalendarDay): void {
    if (!this.editMode || !day.isCurrentMonth) return;

    const dateKey = this.getDateKey(day.date);

    if (this.selectedDaysForStatus.has(dateKey)) {
      this.selectedDaysForStatus.delete(dateKey);
    } else {
      this.selectedDaysForStatus.set(dateKey, this.currentStatusToApply);
    }
  }

  applyStatusToSelectedDays(): void {
    this.selectedDaysForStatus.forEach((status, dateKey) => {
      this.dayStatuses.set(dateKey, status);
    });
    this.selectedDaysForStatus.clear();
    this.editMode = false;
    this.generateCalendar();
  }

  changeStatusForDay(day: CalendarDay, newStatus: DayStatus): void {
    const dateKey = this.getDateKey(day.date);

    if (newStatus === 'neutral') {
      this.dayStatuses.delete(dateKey);
    } else {
      this.dayStatuses.set(dateKey, newStatus);
    }

    this.generateCalendar();
  }

  clearAllStatuses(): void {
    if (confirm('האם אתה בטוח שברצונך להסיר את כל הסימונים?')) {
      this.dayStatuses.clear();
      this.selectedDaysForStatus.clear();
      this.generateCalendar();
    }
  }

  setCurrentStatus(status: DayStatus): void {
    this.currentStatusToApply = status;
  }

  // === ניווט ===

  previousMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1);
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1);
    this.generateCalendar();
  }

  getMonthYear(): string {
    const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
    const month = months[this.currentDate.getMonth()];
    const year = this.currentDate.getFullYear();
    return `${month} ${year}`;
  }

  getFilterStatus(): string {
    if (this.filterType === 'none') return '';

    if (this.filterType === 'single') {
      const date = this.singleDate;
      return `סינון פעיל: ${this.formatDateHebrew(date!)}`;
    }

    const start = this.formatDateHebrew(this.startDate!);
    const end = this.formatDateHebrew(this.endDate!);
    return `סינון פעיל: ${start} - ${end}`;
  }

  private formatDateHebrew(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  formatDateForInput(date: Date | null): string {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getStatusCounts(): { preferred: number; busy: number; neutral: number } {
    let preferred = 0, busy = 0, neutral = 0;

    this.dayStatuses.forEach(status => {
      if (status === 'preferred') preferred++;
      else if (status === 'busy') busy++;
    });

    neutral = this.weeks.reduce((count, week) => {
      return count + week.days.filter(day =>
        day.isCurrentMonth &&
        (this.dayStatuses.get(this.getDateKey(day.date)) || 'neutral') === 'neutral'
      ).length;
    }, 0);

    return { preferred, busy, neutral };
  }

  isDaySelected(day: CalendarDay): boolean {
    return this.selectedDaysForStatus.has(this.getDateKey(day.date));
  }
}

