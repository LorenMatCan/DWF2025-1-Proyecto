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
  loggedIn = false;
  productosNoDisponibles = 0;
  cart: Cart[] = [];
  agotado = false;


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
    if(localStorage.getItem("token")){
      this.loggedIn = true;
    }
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
      this.getcart(v.stock);
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
  

  redirect(){
    this.id = this.rutaActual.snapshot.params['category'];
    if (this.id == undefined){
      this.router.navigate(['/']);
    }else{
      this.router.navigate(['/category/'+this.id]);
    }
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
    const aux = stock - this.productosNoDisponibles;
    for (let i = 0; i < aux; i++) {
      this.stock.push(i);
    }
    if (aux== 0){
      this.form.controls['quantity'].disable();
      this.agotado = true;
    }
  }

  onSubmit(){
    if (this.form.invalid) return;
    if (!this.loggedIn){
      this.swal.errorMessage("Debes iniciar sesión para añadir productos al carrito");
      return;
    }
    let cart = {
      gtin: this.gtin,
      quantity: this.form.value.quantity
    }

    this.cartService.addToCart(cart).subscribe({
      next: (v) => {
        this.swal.successMessage("Producto añadido al carrito");
        window.location.reload();
      },
      error: (e) => {
        console.error(e);
        this.swal.errorMessage(e.error!.message);
      }
    });
    
  }

  getcart(stock:number){
    if (!this.loggedIn){
      this.getStock(stock);
      return;
    };
    this.cartService.getCart().subscribe({
      next: (v) => {
        this.cart = v;
        for(let i = 0; i < this.cart.length; i++){
          if(this.cart[i].gtin == this.gtin){
            this.productosNoDisponibles= this.cart[i].quantity;
          }
        }
        this.getStock(stock)
      },
      error: (e) => {
        console.error(e);
        this.swal.errorMessage(e.error!.message);
      }
    });
  }



}


