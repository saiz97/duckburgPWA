import { NgModule, LOCALE_ID } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AdsComponent } from './components/ads/ads.component';
import { ItemDetailComponent } from './components/item-detail/item-detail.component';
import { MarketplaceComponent } from './components/marketplace/marketplace.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';

import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'marketplace', pathMatch: 'full' },
  { path: 'marketplace', children: [
    { path: '', component: MarketplaceComponent },
    { path: 'item/:id', component: ItemDetailComponent }
  ]},
  { path: 'ads', canActivate: [AuthGuard], children: [
    { path: '', component: AdsComponent, canActivate: [AuthGuard] },
    { path: 'item/:id', component: ItemDetailComponent, canActivate: [AuthGuard] }
  ]},
  { path: 'wishlist', children: [
    { path: '', component: WishlistComponent },
    { path: 'item/:id', component: ItemDetailComponent }
  ]},
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
