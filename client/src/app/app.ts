// packages
import { RouterOutlet } from '@angular/router';
import { Component, signal } from '@angular/core';

// components
import { Toast } from './components/toast/toast';
import { Navbar } from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Toast],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('client');
}
