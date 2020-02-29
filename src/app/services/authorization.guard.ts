import { Inject, Injectable, InjectionToken } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export const ALLOWED_ROLES = new InjectionToken('allowedRoles');

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    @Inject(ALLOWED_ROLES) private allowedRoles: string[],
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.user$.pipe(
      map(user => _.intersection(this.allowedRoles, user.roles).length > 0),
      first(),
      tap(allowed => {
        if (!allowed) {
          this.router.navigateByUrl('/');
        }
      })
    );
  }
}
