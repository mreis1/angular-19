import {Component, inject, OnInit, PLATFORM_ID} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {io, Socket} from 'socket.io-client';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'socket-io-srv-and-cli';
  platformId = inject(PLATFORM_ID)
  io?: Socket;
  ngOnInit() {
    // Only start's the socket.io client if the platformId matches a browser
    if (isPlatformBrowser(this.platformId)) {

      // We use the proxy.conf.json
      // to forward our /socket.io/ path to a different port (4200 > 4000)
      this.io = io('/', {
        transports: ['websocket'],
        path: undefined, // defaults to /socket.io/
      })
      this.io.on('message', (msg) => {
        console.log('Message received: ', msg);
      })
    }
  }

}
