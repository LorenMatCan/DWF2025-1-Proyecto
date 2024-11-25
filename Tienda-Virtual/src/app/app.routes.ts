import { Routes } from '@angular/router';

import { HomeComponent } from './modules/layout/component/home/home.component';
import { CategoryComponent } from './modules/product/component/category/category.component';
import { MainComponent } from './modules/layout/component/main/main.component';
import { LoginComponent } from './modules/auth/component/login/login.component';
import { RegisterComponent } from './modules/auth/component/register/register.component';
import { SecuredComponent } from './modules/auth/component/secured/secured.component';
import { authenticationGuard } from './modules/auth/authentication.guard';
import { ProductComponent } from './modules/product/component/product/product.component';
import { InvoiceComponent } from './modules/invoice/component/invoice/invoice.component';
import { ProductImageComponent } from './modules/product/component/product-image/product-image.component';
import { CustomerComponent } from './modules/customer/component/customer/customer.component';
import { CustomerImageComponent } from './modules/customer/component/customer-image/customer-image.component';
import { InvoiceDetailComponent } from './modules/invoice/component/invoice-detail/invoice-detail.component';
import { ProductDetailComponent } from './modules/product/component/product-detail/product-detail.component';
import { ViewCategoryComponent } from './modules/product/component/view-category/view-category.component';
import { CartComponent } from './modules/invoice/component/cart/cart.component';
export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path : 'cart',
        component: CartComponent

    },
    {
        path: 'category',
        component: CategoryComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'secured',
        component: SecuredComponent, 
        redirectTo: '',
        canActivate: [authenticationGuard]
    },
    {
        path: 'product',
        component: ProductComponent
    },
    {
        path: 'product/:gtin',
        component: ProductImageComponent
    },
    { path: 'invoice', 
    component: InvoiceComponent },
    {
        path: 'customer',
        component: CustomerComponent
    },
    {
        path: 'customer/:rfc',
        component: CustomerImageComponent
    },
    {
        path: 'invoice/:id',
        component: InvoiceDetailComponent
    },
    {
        path: ':gtin',
        component: ProductDetailComponent
    },
    {
        path: 'category/:category',
        component: ViewCategoryComponent
    }

];