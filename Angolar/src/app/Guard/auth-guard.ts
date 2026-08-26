import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../Service/auth';

export const authGuard: CanActivateFn = () => {
  
  const authService = inject(Auth);
  const router = inject(Router);

  if (authService.isUserAuthenticated()) {
    return true; 
  } else {
    router.navigate(['/entry']); 
    return false; 
  }

};
