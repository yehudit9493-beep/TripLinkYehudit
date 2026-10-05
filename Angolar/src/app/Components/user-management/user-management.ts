import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../Service/auth';
import { UserAdminService } from '../../Service/user-admin.service';
import { AdminUser, DEFAULT_PERMISSIONS, PermissionType } from '../../Interfacess/admin-user';

@Component({
  selector: 'app-user-management',
  imports: [CommonModule],
  templateUrl: './user-management.html',
  styleUrl: './user-management.scss',
  standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagement implements OnInit {
  activeTab: 'guides' | 'coordinators' | 'admins' = 'guides';
  users: AdminUser[] = [];
  permissions: PermissionType[] = DEFAULT_PERMISSIONS;

  // המשתמש המורחב כעת + ההרשאות שנבחרו (זמני לפני שמירה)
  expandedUser: AdminUser | null = null;
  pendingPermissions: number[] = [];

  // מנהל-על = הרשאת 1 — רק הוא רואה את לשונית "מנהלי מערכת"
  isSuperAdmin = false;
  isAdmin = false;

  loading = false;

  constructor(
    private authService: Auth,
    private adminService: UserAdminService,
    private router: Router,
        private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    console.log()
    this.isAdmin = this.hasPermission(1) || this.hasPermission(2);
    this.isSuperAdmin = this.hasPermission(1);

    // אם המשתמש אינו מנהל — נחזיר לדף הבית (גייטינג נוסף)
    if (!this.isAdmin) {
      this.router.navigate(['/home-page']);
      return;
    }

    this.loadPermissions();
    this.loadUsers();
  }

  getFullName(u: AdminUser): string {
    return `${u.firstName} ${u.lastName}`;
  }

  hasPermission(permissionId: number): boolean {
    const user = this.authService.getCurrentUser();
    return !!user && (user.permissionIds ?? []).includes(permissionId);
  }

  loadPermissions() {
    this.adminService.getPermissionTypes().subscribe({
      next: (types) => {
        if (types && types.length) {
          this.permissions = types;
          this.cdr.markForCheck();
        }
      },
      error: () => {
        // נשאר עם רשימת ברירת המחדל
      },
    });
  }

  loadUsers() {

    this.loading = true;
    const fetch = this.activeTab === 'guides'
      ? this.adminService.getGuides()
      : this.activeTab === 'coordinators'
        ? this.adminService.getCoordinators()
        : this.adminService.getAdmins();

    fetch.subscribe({
      next: (data) => {
        this.users = data ?? [];
        this.expandedUser = null;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.users = [];
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  selectTab(tab: 'guides' | 'coordinators' | 'admins') {
    this.activeTab = tab;
    this.loadUsers();
  }

  // הרחבת/כיווץ שורה
  toggleExpand(user: AdminUser) {
    if (this.expandedUser?.userId === user.userId) {
      this.expandedUser = null;
      return;
    }
    this.expandedUser = user;
    this.pendingPermissions = [...user.permissionIds];
  }

  // הוספה/הסרה של הרשאה בתיבות הסימון
  togglePermission(permissionId: number) {
    const idx = this.pendingPermissions.indexOf(permissionId);
    if (idx >= 0) {
      this.pendingPermissions.splice(idx, 1);
    } else {
      this.pendingPermissions.push(permissionId);
    }
  }

  isPermissionSelected(permissionId: number): boolean {
    return this.pendingPermissions.includes(permissionId);
  }

  // עדכון הרשאות המשתמש המורחב
  savePermissions() {
    if (!this.expandedUser) return;
    this.adminService.updatePermissions(this.expandedUser.userId, this.pendingPermissions).subscribe({
      next: () => {
        this.expandedUser!.permissionIds = [...this.pendingPermissions];
        this.syncUser(this.expandedUser!);
        this.expandedUser = null;
        this.cdr.markForCheck();
      },
      error: () => {
        this.cdr.markForCheck();
        // נשאר במצב נוכחי
      },
    });
  }

  // משתמש המיועד לחסימה (להצגת הפופ-אפ)
  userToBlock: AdminUser | null = null;

  // לחיצה על עמודת הסטטוס — בחסימה נפתח פופ-אפ, באישור שינוי מיידי
  onStatusClick(user: AdminUser) {
    if (user.isBlocked) {
      // משבירות למאושר — שינוי מיידי ללא אישור
      this.applyStatusChange(user, false);
    } else {
      // ממאושר לחסום — פופ-אפ אזהרה
      this.userToBlock = user;
    }
  }

  // אישור החסימה מהפופ-אפ
  confirmBlock() {
    if (this.userToBlock) {
      this.applyStatusChange(this.userToBlock, true);
    }
    this.userToBlock = null;
  }

  // ביטול הפופ-אפ
  cancelBlock() {
    this.userToBlock = null;
  }

  // ביצוע בפועל של שינוי הסטטוס
  private applyStatusChange(user: AdminUser, blocked: boolean) {
    this.adminService.setBlocked(user.userId, blocked).subscribe({
      next: () => {
        user.isBlocked = blocked;
        this.syncUser(user);
        this.cdr.markForCheck();
      },
      error: () => {
        this.cdr.markForCheck();
        // נשאר במצב נוכחי
      },
    });
  }

  // סנכרון שינוי (חסימה/הרשאות) גם בטבלאות האחרות
  private syncUser(updated: AdminUser) {
    this.users = this.users.map((u) =>
      u.userId === updated.userId ? { ...updated } : u,
    );
  }
}
