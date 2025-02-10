import { Injectable } from '@angular/core';
import {Book} from './book.model';
import {defer, from, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor() { }

  getById(id:number): Promise<Book>{
    return Promise.resolve({id, title: 'Title #' + id })
  }

  loadAll(): Promise<Book[]> {
    return new Promise<Book[]>((resolve) => {
      const books = localStorage.getItem('books')
      if (!books) {
        return resolve([]);
      } else {
        let data: Book[] = [];
        try {
          data = JSON.parse(books)
          return resolve(data);
        } catch (err) {
          console.error('Error loading books...', err);
          return resolve([]);
        }
      }
    })
  }
  async getByQueryAsPromise(q: string): Promise<Book[]> {
    const allBooks = await this.loadAll();
    if (!q) {
      return allBooks;
    }
    return allBooks.filter(v => v.title?.includes(q))
  }
  getByQueryAsObservable(q: string){
    return defer(() => this.getByQueryAsPromise(q));
  }

  removeById(id:number){
    return defer(() => new Promise<Book[]>(async (resolve, reject) => {
      try {
        const allBooks = await this.loadAll();
        const allBookClean = allBooks.filter(b => b.id !== id);
        localStorage.setItem('books', JSON.stringify(allBookClean));
        return resolve(allBookClean);
      }  catch (err) {
        reject(err)
      }
    }))
  }
}
