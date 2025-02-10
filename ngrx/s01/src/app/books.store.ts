import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {Book} from './book.model';
import {computed, inject, InjectionToken} from '@angular/core';
import {BookService} from './book.service';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {tapResponse} from '@ngrx/operators';
import {debounceTime, distinctUntilChanged, mergeMap, Observable, pipe, switchMap, tap} from 'rxjs';

export type ORDER = 'asc' | 'desc';
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
  filter: { query: string; order: ORDER };
};

const initialState: BooksState = {
  books: [],
  isLoading: false,
  filter: {query: '', order: 'asc'},
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
  {providedIn: 'root', protectedState: false},
  withState(() => inject(BOOKS_STATE)),
  // 👇 Accessing previously defined state signals and properties.
  withComputed(({books, filter}) => ({
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
  })),
  // 👇 Accessing a store instance with previously defined state signals,
  // properties, and methods.
  // https://ngrx.io/guide/signals/signal-store#defining-store-methods
  // Methods can be added to the store using the withMethods feature. This feature takes a factory function as an input argument and returns a dictionary of methods. Similar to withComputed, the withMethods factory is also executed within the injection context. The store instance, including previously defined state signals, properties, and methods, is accessible through the factory input.
  // The state of the SignalStore is updated using the patchState function. For more details on the patchState function, refer to the Updating State guide.
  withMethods((store) => { // equivalent: withMethods((store, bookService = inject(BookService)) => {
    const bookService = inject(BookService)
    return {
      addBook: rxMethod((source$: Observable<Book>) => {
        console.log('addBook.1')
        return source$.pipe(
          // mergeMap(async (book: Book) => {
          switchMap(async (book: Book) => {
            try {
              console.log('addBook.2', book)
              // console.log('addBook.2')
              const allBooks = await bookService.loadAll();
              console.log(allBooks);
              // Check if book ID already exists
              if (allBooks.some(b => b.id === book.id)) {
                throw new Error('Book with this ID already exists');
              }
              const updatedBooks = [...allBooks, book];
              localStorage.setItem('books', JSON.stringify(updatedBooks));

              return store.filter.query()
                ? await bookService.getByQueryAsPromise(store.filter.query())
                : patchState(store, (state) => ({...state, books: updatedBooks}));
            } catch (err) {
              console.error(err);
            }
          })
        )
      }),
      updateQuery(query: string): void {
        // 👇 Updating state using the `patchState` function.
        patchState(store, (state) => ({filter: {...state.filter, query}}));
      },
      updateOrder(order: ORDER): void {
        patchState(store, (state) => ({filter: {...state.filter, order}}));
      },
      // loadAll() {
      //   // return this.loadByQuery()
      // },
      loadByQuery: rxMethod<string>(
        pipe(
          debounceTime(300), // optimisation to prevent unnecessary http calls
          distinctUntilChanged(),
          tap(() => {
            console.log('Load by query...');
            patchState(store, {isLoading: true})
          }),
          switchMap((query) => {
            console.log('Query .... ', query);
            // NOTE: This code can be written using two different strategies:
            // /*STRATEGY 1 - Promise    */ return fromPromise(bookService.getByQueryAsPromise(query)).pipe(
            // /*STRATEGY 2 - Observable */ return bookService.getByQueryAsObservable(query).pipe(
            return bookService.getByQueryAsObservable(query).pipe(
              tapResponse({
                next: (books) => patchState(store, {books}),
                error: console.error,
                finalize: () => patchState(store, {isLoading: false}),
              })
            );
          })
        )
      ),
      removeBook: rxMethod<Book>(
        pipe(
          // debounceTime(300),
          distinctUntilChanged(),
          tap(() => {
            console.log('Load by query...');
            patchState(store, {isLoading: true})
          }),
          switchMap((book => {
              // bookService.removeById(book);
              // console.log('Query .... ', query);
              // NOTE: This code can be written using two different strategies:
              // /*STRATEGY 1 - Promise    */ return fromPromise(bookService.getByQueryAsPromise(query)).pipe(
              // /*STRATEGY 2 - Observable */ return bookService.getByQueryAsObservable(query).pipe(
              return bookService.removeById(book.id).pipe(
                tapResponse({
                  next: (books) => {
                    // patchState(store, {books})
                    const query = store.filter.query();
                    patchState(store, {books: query ? books.filter(v => v.title.includes(query)) : books});
                  },
                  error: console.error,
                  finalize: () => patchState(store, {isLoading: false}),
                })
              );
              // return
            })
          )
        )
      ),
    }
  })
);
