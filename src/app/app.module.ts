import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { LoginComponent } from './login/login/login.component';
import { APP_ROUTES } from './app.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {TokenInterceptor} from './interceptors/token.interceptor';
import {ErrorInterceptor} from './interceptors/error.interceptor';
import {CommonModule} from '@angular/common';
import {IConfig, NgxMaskModule} from 'ngx-mask';
import {MessageModalModule} from './modals/desicion-modals/message-modal/message-modal.module';
import {ApiService} from './services/api/api.service';
import {AuthService} from './services/auth/auth.service';
import {SharingService} from './services/sharing/sharing.service';

import {DataTableColumnTypes} from './models/datatables/data-table-column-types';

import {MatPaginatorIntl} from '@angular/material/paginator';
import {getSpanishPaginatorIntl} from './material/paginator-intl';
import {LoadersModule} from './generic-components/loaders/loaders.module';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import {LeafletDrawModule} from '@asymmetrik/ngx-leaflet-draw';
import {QRCodeModule} from "angularx-qrcode";
import {CarouselModule} from "ngx-owl-carousel-o";


export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
  ],
  imports: [
      CommonModule,
      MaterialModule,
      BrowserModule,
      BrowserAnimationsModule,
      FormsModule,
      ReactiveFormsModule,
      APP_ROUTES,
      NgxMaskModule.forRoot(options),
      MessageModalModule,
      HttpClientModule,
    LoadersModule,

    LeafletModule.forRoot(),
    LeafletDrawModule.forRoot(),
      QRCodeModule,
      CarouselModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
      { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() },
      ApiService,
      AuthService,
      SharingService,
      DataTableColumnTypes
  ],
  bootstrap: [AppComponent],
})

export class AppModule {
  public constructor() {}
}
