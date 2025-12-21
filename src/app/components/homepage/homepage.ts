import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { ProductsService } from '../../services/products-service';
import { Product } from '../../models/model';
import { ProductCard } from '../product-card/product-card';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-homepage',
  imports: [ProductCard, ReactiveFormsModule],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage implements OnInit {
  private productsService = inject(ProductsService);
  searchControl = new FormControl('');
  errorMessage: string = '';

  products: Product[] = [];
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];

  ngOnInit() {
    this.getProducts();
    this.setupSearch();
  }

  getProducts() {
    this.productsService.getProducts().subscribe({
      next: (products) => {
        this.allProducts = products;
        this.filteredProducts = products;
        this.products = products;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load products. Please try again later.';
        console.error('Error loading products:', error);
      },
    });
  }

  setupSearch() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.filterProducts(searchTerm || '');
      });
  }

  filterProducts(searchTerm: string) {
    const term = searchTerm.toLowerCase().trim();

    if (!term) {
      this.products = this.allProducts;
      this.errorMessage = '';
      return;
    }

    this.products = this.allProducts.filter(
      (product) =>
        product.title.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
    );

    if (this.products.length === 0) {
      this.errorMessage = `No products found matching "${searchTerm}"`;
    } else {
      this.errorMessage = '';
    }
  }
}
