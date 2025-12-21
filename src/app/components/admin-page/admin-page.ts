import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ProductsService } from '../../services/products-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-page',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-page.html',
  styleUrl: './admin-page.css',
})
export class AdminPage {
  private productsService = inject(ProductsService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  productForm: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessage = '';
  isSubmitting = false;

  constructor() {
    this.productForm = this.formBuilder.group({
      title: new FormControl('', [Validators.required, Validators.minLength(3)]),
      price: new FormControl('', [Validators.required, Validators.min(0.01)]),
      description: new FormControl('', [Validators.required, Validators.minLength(10)]),
      category: new FormControl('', [Validators.required, Validators.minLength(3)]),
      image: new FormControl('', [Validators.required, Validators.pattern('https?://.*')]),
      rating: this.formBuilder.group({
        rate: new FormControl('', [Validators.required, Validators.min(0), Validators.max(5)]),
        count: new FormControl('', [Validators.required, Validators.min(0)]),
      }),
    });
  }

  get f() {
    return this.productForm.controls;
  }

  get ratingControls() {
    const ratingGroup = this.productForm.get('rating') as FormGroup;
    return ratingGroup ? ratingGroup.controls : {};
  }

  onSubmit() {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.productForm.valid) {
      this.isSubmitting = true;
      const formValue = this.productForm.value;
      const productData = {
        title: formValue.title,
        price: parseFloat(formValue.price),
        description: formValue.description,
        category: formValue.category,
        image: formValue.image,
        rating: {
          rate: parseFloat(formValue.rating.rate),
          count: parseInt(formValue.rating.count, 10),
        },
      };

      this.productsService.createProduct(productData as any).subscribe({
        next: (product) => {
          const products = localStorage.getItem('admin-products');
          if (products) {
            const productsArray = JSON.parse(products);
            productsArray.push(product);
            localStorage.setItem('admin-products', JSON.stringify(productsArray));
          } else {
            localStorage.setItem('admin-products', JSON.stringify([product]));
          }
          this.successMessage = 'Product created successfully!';
          this.productForm.reset();
          this.submitted = false;
          this.isSubmitting = false;

          setTimeout(() => {
            this.router.navigate(['']);
          }, 2000);
        },
        error: (error) => {
          console.error('Error creating product:', error);
          this.errorMessage = 'Failed to create product. Please try again.';
          this.isSubmitting = false;
        },
      });
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }
}
