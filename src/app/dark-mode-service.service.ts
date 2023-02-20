import { Injectable } from '@angular/core';
import { Observable, Subject} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class DarkModeServiceService {

  isDarkMode: boolean = (localStorage.getItem("darkMode") ?? "false") == "true"
  
  darkModeSubject = new Subject<boolean>()
  
  darkMode = this.darkModeSubject.asObservable()
  
  constructor() {
    this.darkMode.subscribe((value) => {
      this.isDarkMode = value
      localStorage.setItem("darkMode", value ? "true" : "false")
    })
  }
  
  setDarkMode(darkModeOn: boolean) {
    this.darkModeSubject.next(darkModeOn)
    localStorage.setItem("darkMode", darkModeOn ? "true" : "false")
  }
}
