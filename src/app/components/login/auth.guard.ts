import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Globals } from 'src/app/globals';

@Injectable({providedIn:'root'})
export class AuthGuard implements CanActivate{
    constructor(private globals:Globals, private router: Router){}

    canActivate(
    route:ActivatedRouteSnapshot,
    router:RouterStateSnapshot
    ):boolean|UrlTree|Promise<boolean|UrlTree>|Observable<boolean|UrlTree>
    {
        if (this.globals.getAuthToken()!=null){return true}
        else{return this.router.createUrlTree(['/login']) }
    }
}