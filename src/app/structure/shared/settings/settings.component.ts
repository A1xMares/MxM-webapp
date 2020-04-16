import { Component, OnInit } from '@angular/core';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass']
})
export class SettingsComponent implements OnInit {

  constructor(
      private titleService: Title
  ) {
    this.setTitle('Configuración | MXM');
  }

  ngOnInit() {
  }

  // ---------------- //
  // Set title method //
  // ---------------- //
  public setTitle(newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

}
