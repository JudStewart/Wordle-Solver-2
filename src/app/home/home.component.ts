import { Component, HostListener, QueryList, ViewChildren } from '@angular/core';
import { MatButton } from '@angular/material/button';

const REGEX: RegExp = new RegExp('[a-zA-Z]')

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

// TODO: Setting ideas:
//        - Auto solver for wordle (fills in colors automatically)
//        - use extended dictionary (non wordle words)

  @ViewChildren(HomeComponent) children!: QueryList<HomeComponent>

  words: Array<Array<string>> = [[]];

  insertLetter(c: string)
  {
    let last = this.words.at(-1);
    if (last == undefined) 
    {
      last = [];
      this.words.push(last)
    }
    if (last.length != 5) last?.push(c)
    else this.words.push([c])
  }

  backspace()
  {
    if (this.words.length != 0)
    {
      let last = this.words.at(-1)!;
      if (last.length == 1) this.words.pop();
      else last.pop();
    }
  }
    
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent)
  {
    // console.log(`Event key: '${event.key}'`)
    if (event.key == 'Enter')
    {
      
    }
    else if (event.key == 'Backspace' || event.key == 'Delete')
    {
      this.backspace()
    }
    else if (event.key.length == 1 && REGEX.test(event.key))
    {
      this.insertLetter(event.key.toUpperCase())
    }
  }
}
