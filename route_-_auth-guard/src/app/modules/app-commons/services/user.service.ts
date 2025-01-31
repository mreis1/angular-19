import {computed, Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  loggedIn = signal(false);
  isLoggedIn = computed(() => this.loggedIn())
}
