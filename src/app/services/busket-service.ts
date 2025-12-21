import { Injectable, signal } from '@angular/core';
import { Product } from '../models/model';

@Injectable({
  providedIn: 'root',
})
export class BusketService {
  private busket: { product: Product; quantity: number }[] = [];
  private busketCount = signal<number>(0);

  constructor() {
    // Load from localStorage on init
    const savedBusket = localStorage.getItem('busket');
    if (savedBusket) {
      this.busket = JSON.parse(savedBusket);
      this.updateCount();
    }
  }

  getBusket() {
    return this.busket;
  }

  getBusketCount() {
    return this.busketCount.asReadonly();
  }

  private updateCount() {
    const total = this.busket.reduce((sum, item) => sum + item.quantity, 0);
    this.busketCount.set(total);
  }

  addToBusket(product: Product) {
    if (this.busket.find((p) => p.product.id === product.id)) {
      this.busket.find((p) => p.product.id === product.id)!.quantity++;
    } else {
      this.busket.push({ product, quantity: 1 });
    }

    localStorage.setItem('busket', JSON.stringify(this.busket));
    this.updateCount();
  }

  removeFromBusket(product: Product) {
    if (this.busket.find((p) => p.product.id === product.id)) {
      this.busket.find((p) => p.product.id === product.id)!.quantity--;
    }
    if (this.busket.find((p) => p.product.id === product.id)!.quantity === 0) {
      this.busket = this.busket.filter((p) => p.product.id !== product.id);
    }
    localStorage.setItem('busket', JSON.stringify(this.busket));
    this.updateCount();
  }
}
