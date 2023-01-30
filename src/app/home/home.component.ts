import {
  Component,
  HostBinding,
  HostListener,
  QueryList,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { DarkModeServiceService } from '../dark-mode-service.service'


const WordleWords: Array<string> = require('./wordle-words.json')
const REGEX: RegExp = new RegExp('[a-zA-Z]');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  // TODO: Setting ideas:
  //        - Auto solver for wordle (fills in colors automatically)
  //        - use extended dictionary (non wordle words)

  @HostBinding('class') className = ''

  words: Array<Array<WordleLetter>> = [[]];
  answers: Array<string> = [];
  
  isDarkMode = false;
  
  constructor(public darkMode: DarkModeServiceService) {}
  
  ngOnInit() {
    this.darkMode.darkMode.subscribe((darkMode) => {
      this.className = darkMode ? 'darkMode' : ''
      this.isDarkMode = darkMode
      this.words.forEach((word) => {
        word.forEach((letter) => letter.updateColor(this.isDarkMode))
      })
    })
  }

  insertLetter(c: string) {
    let last = this.words.at(-1);
    if (last == undefined) {
      last = [];
      this.words.push(last);
    }
    if (last.length != 5) last?.push(new WordleLetter(c, last.length));
    else this.words.push([new WordleLetter(c, 0)]);
  }

  backspace() {
    if (this.words.length != 0) {
      let last = this.words.at(-1)!;
      if (last.length == 1) this.words.pop();
      else last.pop();
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // console.log(`Event key: '${event.key}'`)
    if (event.key == 'Enter') {
      this.solve();
    } else if (event.key == 'Backspace' || event.key == 'Delete') {
      this.backspace();
    } else if (event.key.length == 1 && REGEX.test(event.key)) {
      this.insertLetter(event.key.toLowerCase());
    }
  }

  solve() {
    //declare an array to store all filters
    let filters: Array<(data: string) => boolean> = [];
    
    this.words.forEach((word) => {
      //get actual word as string
      let actualWord = this.letterArrayToString(word)

      //check for duplicate letters
      if (this.hasRepeatCharacters(actualWord)) {
        
        //find duplicate letter(s)
        let checked = new Set();
        word.forEach((l) => {
          
          // if this letter hasn't been checked yet
          if (!checked.has(l.letter)) {
            // add the letter to the set
            checked.add(l.letter);

            //get all WordleLetter instances of this letter
            let thisLetter = word.filter((item) =>item.letter == l.letter);

            let nonGrayCount = thisLetter.filter(item => item.color != WordleColor.GRAY).length
            
            // If there are non-gray duplicates
            if (nonGrayCount != 0) {
              //handle those instances
              thisLetter.forEach((element) => {
                switch (element.color) {
                  case WordleColor.GREEN:
                    //add a filter checking that the character matches
                    filters.push((str: string): boolean => {
                      return str.charAt(element.position) == element.letter;
                    });
                    break;
                  
                  // In this case, if there are non-gray and gray letters, gray is treated the same as yellow.
                  case WordleColor.GRAY:
                  case WordleColor.YELLOW:
                    //add a filter checking that the word contains the letter, but at a different position
                    filters.push((str: string): boolean => {
                      return (
                        str.includes(element.letter) &&
                        str.charAt(element.position) != element.letter
                      );
                    });
                    break;
                }
                //add the filter to check for the word having the correct number of this letter
                filters.push((str: string): boolean => {
                  return (
                    (str.match(new RegExp(l.letter, 'g')) || []).length == nonGrayCount
                  )})
              })
            }
            else {
              // if all the instances of this letter are gray, then the word doesn't contain that letter
              filters.push((str: string): boolean => {
                return !str.includes(l.letter);
              });
            }
          }
        });
      }
      
      // if there are no repeated letters
      else {
        word.forEach (letter => {
          switch (letter.color) 
          {
            case WordleColor.GRAY:
              filters.push((str: string): boolean => {
                return !str.includes(letter.letter)
              })
              break;
            case WordleColor.GREEN:
              filters.push((str: string): boolean => {
                return str.charAt(letter.position) == letter.letter
              })
              break;
            case WordleColor.YELLOW:
              filters.push((str: string): boolean => {
                return !(str.charAt(letter.position) == letter.letter) && str.includes(letter.letter)
              })
              break;
          }
        })
      }
    });
    
    
    let possibleWords = WordleWords
    filters.forEach(filter => {
      possibleWords = possibleWords.filter(filter)
    })
    
    this.answers = possibleWords.sort()
    
  }
  
  // -------- Utility Functions --------
  
  //https://stackoverflow.com/a/62136512
  hasRepeatCharacters(str: string): boolean {
    return new Set(str).size < str.length
  }
  
  //https://stackoverflow.com/a/881111
  count(str: string, substr: string): number {
    return (str.match(new RegExp(substr, "g")) || []).length
  }
  
  letterArrayToString(arr: Array<WordleLetter>): string {
    let output = ''
    arr.forEach((letter) => (output += letter.letter));
    return output;
  }
}

class WordleLetter {
  letter: string;
  color: WordleColor = WordleColor.GRAY;
  style: string = '';
  position: number;

  constructor(letter: string, pos: number) {
    this.letter = letter;
    this.position = pos;
  }

  toString(): string {
    return this.letter + '(' + this.color + ', ' + this.position + ')';
  }

  parseColor(color: WordleColor, isDarkMode: boolean) {
    switch (color) {
      case WordleColor.GRAY:
        return isDarkMode ? '#3a3a3c' : '#787c7e';
      case WordleColor.GREEN:
        return isDarkMode ? '#538d4e' : '#6aaa64';
      case WordleColor.YELLOW:
        return isDarkMode ? '#b59f3b' : '#c9b458';
    }
  }

  toggleColor(isDarkMode: boolean) {
    this.color = (this.color + 1) % 3;
    this.updateColor(isDarkMode)
  }
  
  updateColor(isDarkMode: boolean) {
    this.style = this.parseColor(this.color, isDarkMode);
  }
}

enum WordleColor {
  GRAY,
  YELLOW,
  GREEN,
}
