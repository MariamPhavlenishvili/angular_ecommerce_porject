import { Component, inject, OnInit, effect } from '@angular/core';
import { BusketService } from '../../services/busket-service';
import { Product } from '../../models/model';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  private busketService = inject(BusketService);
  busket: { product: Product; quantity: number }[] = [];

  constructor() {
    this.busket = this.busketService.getBusket();

    // Update busket when it changes
    effect(() => {
      this.busketService.getBusketCount()();
      this.busket = this.busketService.getBusket();
    });
  }

  ngOnInit() {
    this.busket = this.busketService.getBusket();
  }

  getBusket() {
    return this.busketService.getBusket();
  }

  removeFromBusket(product: Product) {
    this.busketService.removeFromBusket(product);
    this.busket = this.busketService.getBusket();
  }

  addToBusket(product: Product) {
    this.busketService.addToBusket(product);
    this.busket = this.busketService.getBusket();
  }

  removeItem(product: Product) {
    // Remove all quantities of the product
    const item = this.busket.find((p) => p.product.id === product.id);
    if (item) {
      while (item.quantity > 0) {
        this.busketService.removeFromBusket(product);
      }
      this.busket = this.busketService.getBusket();
    }
  }

  getTotal() {
    return this.busket.reduce(
      (sum: number, item: { product: Product; quantity: number }) =>
        sum + item.product.price * item.quantity,
      0
    );
  }
}
