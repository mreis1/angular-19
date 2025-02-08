import { signalStore, withState } from '@ngrx/signals';
import { Book } from './book.model';
import {inject, InjectionToken} from '@angular/core';

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

type BooksState = {
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

/**
 * The withState feature also has a signature that takes the initial state factory as an input argument. The factory is executed within the injection context, allowing initial state to be obtained from a service or injection token.
 */
export const BooksStore = signalStore(
  withState(() => inject(BOOKS_STATE))
);
