import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';

import { MarketplaceComponent } from './components/marketplace/marketplace.component';
import { AdsComponent } from './components/ads/ads.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { MpComicsComponent } from './components/marketplace/mp-comics/mp-comics.component';
import { MpFiguresComponent } from './components/marketplace/mp-figures/mp-figures.component';
import { MpClothesComponent } from './components/marketplace/mp-clothes/mp-clothes.component';
import { AdsOverviewComponent } from './components/ads/ads-overview/ads-overview.component';
import { AdsNewItemComponent } from './components/ads/ads-new-item/ads-new-item.component';

import { DataService } from './service/data.service';
import { TokenInterceptor } from './service/token.interceptor';
import { LoaderComponent } from './shared/loader/loader.component';
import { ItemDetailComponent } from './components/item-detail/item-detail.component';

import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeDEAT from '@angular/common/locales/de-AT';

registerLocaleData(localeDEAT);

@NgModule({
  declarations: [
    AppComponent,
    MarketplaceComponent,
    AdsComponent,
    WishlistComponent,
    LoginComponent,
    SignupComponent,
    MpComicsComponent,
    MpFiguresComponent,
    MpClothesComponent,
    AdsOverviewComponent,
    AdsNewItemComponent,
    LoaderComponent,
    ItemDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule,

    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatButtonToggleModule,
    MatCardModule,
    MatSelectModule,
    HttpClientModule,
    MatInputModule,
    MatListModule
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
      provide: LOCALE_ID,
      useValue: 'de-at'
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
