import {CanActivateFn, Router, UrlTree} from '@angular/router';
import {inject} from '@angular/core';
import {UserService} from './modules/app-commons/services/user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const user: UserService = inject(UserService);
  const router = inject(Router);
  console.log('authGuard', user, user.isLoggedIn());
  const res = user.isLoggedIn();
  console.log('res', res);

  /**
   * If user is unauthorized to login we can return a "url tree" that specifies the new navigation destination
   */
  return res || router.createUrlTree(['/auth']);
};
