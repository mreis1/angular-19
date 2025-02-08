import {Component, inject} from '@angular/core';
import {BooksStore} from '../books.store';

@Component({
  selector: 'app-book',
  imports: [],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css',
  providers: []
})
export class BookComponent {
  book = inject(BooksStore);

}
