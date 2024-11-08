import { Component } from '@angular/core';
import { SharedModule } from '../../../../shared/shared-module';
import { DtoProductList } from '../../../product/_dto/dto-product-list';
import { Category } from '../../../product/_model/category';
import { SwalMessages } from '../../../../shared/swal-messages';
import { CategoryService } from '../../../product/_service/category.service';
import { ProductService } from '../../../product/_service/product.service';
import { ProductImageService } from '../../../product/_service/product-image.service';
import { Router } from '@angular/router';
import { ProductImage } from '../../../product/_model/product-image';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  products: DtoProductList[] = []; // product list

  categories: Category[] = []; // category list

  swal: SwalMessages = new SwalMessages(); // swal messages

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private  router: Router = new Router(), // router
    private productImageService: ProductImageService
  ){}

  ngOnInit(){
    this.getProducts();
  }

  getProducts(){
    this.productService.getProducts().subscribe({
      next: (v) => {
        this.products = v;
        for (let product of this.products){
          this.asignImage(product);
        }
      },
      error: (e) => {
        console.log(e);
        this.swal.errorMessage(e.error!.message); // show message
      }
    });
  }


  asignImage(product: DtoProductList){
     img: ProductImage;
    this.productImageService.getProductImages(product.product_id).subscribe({
      next: (v) => {
        const img = v[0];
        product.image = img.image;
      },
      error: (e) => {
        console.log(e);
        this.swal.errorMessage(e.error!.message); // show message
      }
    });
  }





}





