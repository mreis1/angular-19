import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {ORDER} from '../books.store';

@Component({
  selector: 'app-books-filter',
  imports: [],
  templateUrl: './books-filter.component.html',
  styleUrl: './books-filter.component.css'
})
export class BooksFilterComponent {
  @Input() query: string = '';
  @Input() order: string = 'asc';

  @Output() queryChange = new EventEmitter<string>();
  @Output() orderChange = new EventEmitter<ORDER>();

  onQueryChange(event: Event) {
    this.queryChange.emit((event.target as HTMLInputElement).value);
  }

  onOrderChange(event: Event) {
    const newOrder = (event.target as HTMLInputElement).value as ORDER
    this.orderChange.emit(newOrder);
  }
}
