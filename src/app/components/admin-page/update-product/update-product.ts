import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../../../models/model';
import { ProductsService } from '../../../services/products-service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-update-product',
  imports: [ReactiveFormsModule],
  templateUrl: './update-product.html',
  styleUrl: './update-product.css',
})
export class UpdateProduct implements OnInit {
  private productsService = inject(ProductsService);
  private route = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  product: Product | any = null;

  productForm: FormGroup = new FormGroup({});
  submitted = false;
  successMessage = '';
  errorMessage = '';
  isLoading = true;
  isSubmitting = false;

  ngOnInit() {
    const productId = Number(this.route.snapshot.params['id']);
    this.productsService.getProduct(productId).subscribe({
      next: (product) => {
        this.product = product;
        this.initializeForm();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load product. Please try again later.';
        this.isLoading = false;
        console.error('Error loading product:', error);
      },
    });
  }

  initializeForm() {
    if (this.product) {
      this.productForm = this.formBuilder.group({
        title: new FormControl(this.product.title, [Validators.required, Validators.minLength(3)]),
        price: new FormControl(this.product.price, [Validators.required, Validators.min(0.01)]),
        description: new FormControl(this.product.description, [
          Validators.required,
          Validators.minLength(10),
        ]),
        category: new FormControl(this.product.category, [
          Validators.required,
          Validators.minLength(3),
        ]),
        image: new FormControl(this.product.image, [
          Validators.required,
          Validators.pattern('https?://.*'),
        ]),
        rating: this.formBuilder.group({
          rate: new FormControl(this.product.rating.rate, [
            Validators.required,
            Validators.min(0),
            Validators.max(5),
          ]),
          count: new FormControl(this.product.rating.count, [
            Validators.required,
            Validators.min(0),
          ]),
        }),
      });
    }
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

    if (this.productForm.valid && this.product) {
      this.isSubmitting = true;
      const formValue = this.productForm.value;
      const productData = {
        id: this.product.id,
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

      this.productsService.updateProduct(productData as Product).subscribe({
        next: (product) => {
          this.product = product;
          this.successMessage = 'Product updated successfully!';
          this.submitted = false;
          this.isSubmitting = false;
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2000);
        },
        error: (error) => {
          console.error('Error updating product:', error);
          this.errorMessage = 'Failed to update product. Please try again.';
          this.isSubmitting = false;
        },
      });
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }
}
