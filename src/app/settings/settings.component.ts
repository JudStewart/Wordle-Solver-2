import { Component } from '@angular/core';
import { FormControl } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { DarkModeServiceService } from '../dark-mode-service.service'
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  constructor(private dialogRef: MatDialogRef<SettingsComponent>, public darkModeService: DarkModeServiceService) {}
  darkMode: boolean = this.darkModeService.isDarkMode
  toggleControl = new FormControl(false)
  
  ngOnInit(): void {
    console.log("[DEBUG] on init, dark mode value is " + this.darkMode)
    
    this.darkModeService.darkMode.subscribe((darkMode) => {
      this.darkMode = darkMode
    })
    
    this.toggleControl.setValue(this.darkMode)
    
    this.toggleControl.valueChanges.subscribe((darkMode) => {
      if (darkMode != null) this.darkModeService.setDarkMode(darkMode)
    })
  }
}
