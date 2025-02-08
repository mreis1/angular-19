import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {BookComponent} from './book/book.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BookComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Starter';
}
