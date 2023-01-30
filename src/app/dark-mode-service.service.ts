import { Injectable } from '@angular/core';
import { Observable, Subject} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class DarkModeServiceService {

  isDarkMode: boolean = false
  
  darkModeSubject = new Subject<boolean>()
  
  darkMode = this.darkModeSubject.asObservable()
  
  constructor() {
    this.darkMode.subscribe((value) => {
      this.isDarkMode = value
    })
  }
  
  setDarkMode(darkModeOn: boolean) {
    this.darkModeSubject.next(darkModeOn)
  }
}
