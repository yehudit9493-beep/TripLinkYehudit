// שורת טבלה בדף ניהול המשתמשים
export interface AdminUser {
  userId: number;
  firstName: string;
  lastName: string;
  userName: string;
  isBlocked: boolean;
  permissionIds: number[];
}

// קטגוריית הרשאה (מאוחזרת מהשרת)
export interface PermissionType {
  permissionId: number;
  permissionName: string;
}

// רשימת ההרשאות הקבועות (משמשת כברירת מחדל אם השרת אינו מחזיר שמות)
export const DEFAULT_PERMISSIONS: PermissionType[] = [
  { permissionId: 1, permissionName: 'מנהל כללי' },
  { permissionId: 2, permissionName: 'מנהל משני' },
  { permissionId: 3, permissionName: 'ניהול מסלולים' },
  { permissionId: 4, permissionName: 'ניהול אטרקציות' },
  { permissionId: 5, permissionName: 'ניהול מקומות לינה' },
  { permissionId: 6, permissionName: 'מענה בפורום שאלות' },
  { permissionId: 7, permissionName: 'מענה בפורום בטיחות' },
];
