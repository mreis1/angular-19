import {Component, inject, Inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {BookComponent} from './book/book.component';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {BooksState, BooksStore} from './books.store';
import {patchState} from '@ngrx/signals';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BookComponent, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Starter';
  store = inject(BooksStore);
  bookTitleCtrl = new FormControl('', [Validators.required]);
  handleSubmit() {
    if (this.bookTitleCtrl.invalid) {
      return
    }
    // ⚠️ The state of the `BooksStore` is unprotected from external modifications.
    //    If you forget to set protectedState in store
    //    compiler will throw ... Types of property '[STATE_SOURCE]' are incompatible.
    patchState(this.store, ({ books }) => ({ books: [...books, {
        id: new Date().getTime(),
        title: this.bookTitleCtrl.value!
      }]
    }));
  }
}
