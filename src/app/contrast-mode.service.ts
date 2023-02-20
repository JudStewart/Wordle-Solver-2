import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ContrastModeService {

  isHighContrastMode: boolean = (localStorage.getItem("highContrastMode") ?? "false") == "true";
  
  contrastSubject = new Subject<boolean>()

  contrastMode = this.contrastSubject.asObservable()
  
  constructor() {
    this.contrastMode.subscribe((value) => {
      this.isHighContrastMode = value;
      localStorage.setItem("highContrastMode", value ? "true" : "false")
    })
  }
  
  setHighContrastMode(contrastModeOn: boolean) {
    this.contrastSubject.next(contrastModeOn)
    localStorage.setItem("highContrastMode", contrastModeOn ? "true" : "false")
  }
}
