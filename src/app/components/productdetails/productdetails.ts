import { Component, inject } from '@angular/core';
import { ProductsService } from '../../services/products-service';
import { Product } from '../../models/model';
import { ActivatedRoute } from '@angular/router';
import { BusketService } from '../../services/busket-service';

@Component({
  selector: 'app-productdetails',
  imports: [],
  templateUrl: './productdetails.html',
  styleUrl: './productdetails.css',
})
export class Productdetails {
  private productsService = inject(ProductsService);
  private busketService = inject(BusketService);
  product: Product | any;

  constructor(private route: ActivatedRoute) {
    this.getProduct(this.route.snapshot.params['id']);
  }

  getProduct(productId: number) {
    this.productsService.getProduct(productId).subscribe((product) => {
      this.product = product;
    });
  }

  addToBusket(product: Product) {
    this.busketService.addToBusket(product);
  }

  removeFromBusket(product: Product) {
    this.busketService.removeFromBusket(product);
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
}
