import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../_service/product.service';
import { SwalMessages } from '../../../../shared/swal-messages';
import { SharedModule } from '../../../../shared/shared-module';
import { CategoryService } from '../../_service/category.service';
import { Category } from '../../_model/category';
import { ProductImage } from '../../_model/product-image';
import { ProductImageService } from '../../_service/product-image.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Cart } from '../../../invoice/_model/cart';
import { CartService } from '../../../invoice/_service/cart.service';





@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'

})
export class ProductDetailComponent {

  gtin: string = "";
  product: any = {}
  swal = new SwalMessages();
  submitted = false;
  categories: Category[] = [];
  id = 0;
  productImgs: ProductImage[] = [];
  stock: number[]=[]



  form = this.formBuilder.group({
    quantity: ["",[Validators.required]],
  });


  constructor(
    private  router: Router = new Router(), // router
    private rutaActual: ActivatedRoute = new ActivatedRoute(), // ruta actual
    private productService: ProductService, 
    private categoryService: CategoryService,
    private productImageService: ProductImageService,
    private formBuilder: FormBuilder,
    private cartService: CartService
  ){}


  ngOnInit(){

    this.gtin = this.rutaActual.snapshot.params['gtin'];
    this.product = this.getProductDetail();
    this.getCategories();
  }

  getProductDetail(){
    this.productService.getProduct(this.gtin).subscribe({
    next: (v) => {
      this.product = v;
      this.id = v.product_id;
      this.getProductImages(v.product_id);
      this.getStock(v.stock);
    },
    error: (e) => {
      this.swal.errorMessage("Hubo un error de conexión");
    }
    })
  }

  getProductImages(id:number){
    this.productImageService.getProductImages(id).subscribe({
      next: (v) => {
        this.productImgs = v;
        console.log(this.productImgs);
      },
      error: (e) => {
        console.error(e);
        this.swal.errorMessage("No se pudieron cargar las imagenes del producto");
      }
    });
  }
  

  redirect(url:String[]){
    this.router.navigate(url); 
  }


  getCategories(){
    this.categoryService.getActiveCategories().subscribe({
      next: (v) => {
        this.categories = v;
      },
      error: (e) => {
        console.log(e);
        this.swal.errorMessage(e.error!.message); // show message
      }
    });
  }

  getStock(stock:number){
    console.log(stock);
    for (let i = 0; i < stock; i++) {
      this.stock.push(i);
    }
    console.log(this.stock);
  }

  onSubmit(){
    if (this.form.invalid) return;
    let cart = {
      gtin: this.gtin,
      quantity: this.form.value.quantity
    }

    this.cartService.addToCart(cart).subscribe({
      next: (v) => {
        this.swal.successMessage("Producto añadido al carrito");
      },
      error: (e) => {
        console.error(e);
        this.swal.errorMessage(e.error!.message);
      }
    });
    
  }
}


