import { Routes } from '@angular/router';
import { Homepage } from './components/homepage/homepage';
import { Productdetails } from './components/productdetails/productdetails';
import { Cart } from './components/cart/cart';
import { AdminPage } from './components/admin-page/admin-page';
import { PageNotFound } from './components/page-not-found/page-not-found';
import { UpdateProduct } from './components/admin-page/update-product/update-product';

export const routes: Routes = [
  {
    path: '',
    component: Homepage,
    pathMatch: 'full',
  },
  {
    path: 'product/:id',
    component: Productdetails,
  },
  {
    path: 'cart',
    component: Cart,
  },
  {
    path: 'admin/create-product',
    component: AdminPage,
  },
  {
    path: 'admin/edit-product/:id',
    component: UpdateProduct,
  },
  {
    path: '**',
    component: PageNotFound,
  },
];
