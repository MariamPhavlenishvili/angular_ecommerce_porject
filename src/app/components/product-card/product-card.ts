import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../models/model';
import { BusketService } from '../../services/busket-service';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input() product!: Product;
  @Output() productClick = new EventEmitter<Product>();

  private busketService = inject(BusketService);
  private router = inject(Router);

  addToBusket(event: Event, product: Product) {
    event.stopPropagation();
    this.busketService.addToBusket(product);
  }

  getStars(rating: number): boolean[] {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars: boolean[] = [];

    for (let i = 0; i < 5; i++) {
      stars.push(i < fullStars || (i === fullStars && hasHalfStar));
    }

    return stars;
  }

  navigateToProductDetails(product: Product) {
    this.router.navigate(['/product', product.id]);
  }
}
