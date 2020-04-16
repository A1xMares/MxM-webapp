import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GoogleMapRangeComponent} from "./google-map-range.component";
import {MaterialModule} from "../../../material/material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    GoogleMapRangeComponent
  ],
  imports: [
    CommonModule,
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB42A1taDMidGcw_8yyxvg80IsHnnBZBqA'
    })
  ],
  exports: [
    GoogleMapRangeComponent
  ],
  entryComponents:[
    GoogleMapRangeComponent
  ]
})
export class GoogleMapRangeModule { }
