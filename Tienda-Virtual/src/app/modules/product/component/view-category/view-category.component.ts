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
import { ActivatedRoute } from '@angular/router';
import { routes } from '../../../../app.routes';

@Component({
  selector: 'app-view-category',
  standalone: true,
  imports: [],
  templateUrl: './view-category.component.html',
  styleUrl: './view-category.component.css'
})
export class ViewCategoryComponent {


  products: DtoProductList[] = []; // product list

  categories: Category[] = []; // category list

  swal: SwalMessages = new SwalMessages(); // swal messages

  isAdmin = false;
   
  name: string = "";
   
  id: number = 0;

  



  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private  router: Router = new Router(), // router
    private productImageService: ProductImageService,
    private rutaActual: ActivatedRoute = new ActivatedRoute(),
  ){}

  ngOnInit(){
    if(localStorage.getItem("user")){
      let user = JSON.parse(localStorage.getItem("user")!);
      if(user.rol == "ADMIN"){
        this.isAdmin = true;
      }else{
        this.isAdmin = false;
      }
    }
    this.id = this.rutaActual.snapshot.params['category'];
    this.getCategory();
    this.getProducts();


  }

  getCategory(){
    this.categoryService.getCategory(this.id).subscribe({
      next: (v) => {
        this.name = v.category;
      },
      error: (e) => {
        console.log(e);
        this.swal.errorMessage(e.error!.message); // show message
      }
    });
  }



  getProducts(){
    this.productService.getProductsByCategory(this.id).subscribe({
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
     product.image = "";
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

  showProduct(gtin: string){
    if (this.isAdmin){
      this.router.navigate(["/product/"+gtin]);
    }
    else{
      this.router.navigate(["/"+gtin]);
    }
  }






}
