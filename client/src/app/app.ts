// packages
import { RouterOutlet } from '@angular/router';
import { Component, signal } from '@angular/core';

// components
import { Navbar } from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('client');
}
