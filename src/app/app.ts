import { Component, signal, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { BusketService } from './services/busket-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('ecommerce-app');
  private busketService = inject(BusketService);
  protected readonly basketCount = this.busketService.getBusketCount();
  private router = inject(Router);

  navigateToCart(event: Event) {
    event.preventDefault();
    this.router.navigate(['/cart']);
  }
}
