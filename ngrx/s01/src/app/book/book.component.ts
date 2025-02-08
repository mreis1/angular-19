import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {BooksStore} from '../books.store';
import {JsonPipe} from '@angular/common';

@Component({
  selector: 'app-book',
  imports: [JsonPipe],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css',
  // copied from the tutorial --> https://ngrx.io/guide/signals/signal-store#reading-state
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: []
})
export class BookComponent {
  store = inject(BooksStore);
  ngOnInit() {
    // this.store.books()
  }
}
