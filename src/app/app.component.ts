import { Component, HostBinding } from '@angular/core';
import {MatDialog} from '@angular/material/dialog'
import { DarkModeServiceService } from './dark-mode-service.service'
import { SettingsComponent } from './settings/settings.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @HostBinding('class') className = ''
  
  darkMode = false;
  title = 'wordle-solver';
  constructor(public dialog: MatDialog, private darkModeService: DarkModeServiceService) {}
  
  ngOnInit() {
    this.darkModeService.darkMode.subscribe(isDarkMode => {
      this.className = isDarkMode ? 'darkMode' : ''
      this.darkMode = isDarkMode
    })
  }
  
  openSettingsDialog() {
    let dialogRef = this.dialog.open(SettingsComponent, {
      width: '400px'
    })
  }
}
