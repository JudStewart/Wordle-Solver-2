import { Component, HostBinding } from '@angular/core';
import { FormControl } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { DarkModeServiceService } from '../dark-mode-service.service'
import { FormsModule } from '@angular/forms';
import { ContrastModeService } from '../contrast-mode.service'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  @HostBinding('class') className = 'darkDialog'
  constructor(private dialogRef: MatDialogRef<SettingsComponent>, public darkModeService: DarkModeServiceService, public contrastService: ContrastModeService) {}
  darkMode: boolean = this.darkModeService.isDarkMode
  darkModeToggleControl = new FormControl(false)
  
  highConstrastMode: boolean = this.contrastService.isHighContrastMode
  contrastToggleControl = new FormControl(false)
  
  ngOnInit(): void {    
    this.darkModeService.darkMode.subscribe((darkMode) => {
      this.className = darkMode ? 'darkDialog' : ''
      this.darkMode = darkMode
    })
    
    this.darkModeToggleControl.setValue(this.darkMode)
    
    this.darkModeToggleControl.valueChanges.subscribe((darkMode) => {
      if (darkMode != null) this.darkModeService.setDarkMode(darkMode)
    })
    
    this.contrastService.contrastMode.subscribe((contrastMode) => {
      this.highConstrastMode = contrastMode
    })
    
    this.contrastToggleControl.setValue(this.highConstrastMode)
    
    this.contrastToggleControl.valueChanges.subscribe((contrastMode) => {
      if (contrastMode != null) this.contrastService.setHighContrastMode(contrastMode)
    })
  }
}
