import { Component } from '@angular/core';
import { Globals } from './globals';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private globals: Globals){this.globals.start();}
  title = 'StayPrivate Dashboard';
  
}
