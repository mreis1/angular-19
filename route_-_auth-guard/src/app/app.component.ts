import {Component, inject, Inject} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from '@angular/router';
import {UserService} from './modules/app-commons/services/user.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  user = inject(UserService);
  router = inject(Router);
  logout(): void {
    console.log('logged out.');
    this.user.loggedIn.set(false);

    // ✅ 1. Force Router to Re-Evaluate Guards (Best Trick)
    // if we're on a router that might require authentication we need to redirect the user away
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([this.router.url]); // Re-trigger activation checks
    });

  }
}
