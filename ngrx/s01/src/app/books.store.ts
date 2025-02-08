import {signalStore, withComputed, withState} from '@ngrx/signals';
import { Book } from './book.model';
import {computed, inject, InjectionToken} from '@angular/core';

/*
```
The BooksStore instance will contain the following properties:

books: Signal<Book[]>
isLoading: Signal<boolean>
filter: DeepSignal<{ query: string; order: 'asc' | 'desc' }>
filter.query: Signal<string>
filter.order: Signal<'asc' | 'desc'>



```
*/

export type BooksState = {
  books: Book[];
  isLoading: boolean;
  filter: { query: string; order: 'asc' | 'desc' };
};

const initialState: BooksState = {
  books: [],
  isLoading: false,
  filter: { query: '', order: 'asc' },
};


// The withState feature is used to add state slices to the SignalStore. This feature accepts initial state as an input argument. As with signalState, the state's type must be a record/object literal.
/*
export const BooksStore = signalStore(
  withState(initialState)
);*/

const BOOKS_STATE = new InjectionToken<BooksState>('BooksState', {
  factory: () => initialState,
});

export const BooksStore = signalStore(
  // 👇 Providing `BooksStore` at the root level.
  { providedIn: 'root', protectedState: false },
  withState(() => inject(BOOKS_STATE)),
  // 👇 Accessing previously defined state signals and properties.
  withComputed(({ books, filter }) => ({
    booksCount: computed(() => books().length),
    sortedBooks: computed(() => {
      const direction = filter.order() === 'asc' ? 1 : -1;

      /*
      ** ES2023 reserved **
      return books().toSorted((a, b) =>
        direction * a.title.localeCompare(b.title)
      );

      Bellow I use an alternative compatible with older ES
       */
      return books().slice()
        .sort((a, b) => direction * a.title.localeCompare(b.title));
    }),
  }))
);
