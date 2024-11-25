import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../_service/product.service';
import { SwalMessages } from '../../../../shared/swal-messages';
import { SharedModule } from '../../../../shared/shared-module';
import { FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from '../../_service/category.service';
import { Category } from '../../_model/category';
import { Product } from '../../_model/ product';
import { ProductImage } from '../../_model/product-image';
import { ProductImageService } from '../../_service/product-image.service';
import { NgxPhotoEditorService } from 'ngx-photo-editor';




declare var $: any;

@Component({
  selector: 'app-product-image',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './product-image.component.html',
  styleUrl: './product-image.component.css'

})
export class ProductImageComponent {

  gtin: string = "";
  product: any = {}
  swal = new SwalMessages();
  submitted = false;
  categories: Category[] = [];
  id = 0;
  productImgs: ProductImage[] = [];

  form = this.formBuilder.group({
    product: ["", [Validators.required]],
    gtin: ["", [Validators.required, Validators.pattern('^[0-9]{13}$')]],
    description: ["", [Validators.required]],
    price: [0, [Validators.required, Validators.pattern('^[0-9]*$')]],
    stock: [0, [Validators.required, Validators.pattern('^[0-9]*$')]],
    category_id: [0, [Validators.required]],
  });


  constructor(
    private  router: Router = new Router(), // router
    private rutaActual: ActivatedRoute = new ActivatedRoute(), // ruta actual
    private productService: ProductService, 
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private ngxService: NgxPhotoEditorService,
    private productImageService: ProductImageService
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


  showModalForm(){
    $("#modalForm").modal("show");
    this.form.reset();
    this.submitted = false;
  }

  hideModalForm(){
    $("#modalForm").modal("hide");
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

  onSubmit():void{
    this.submitted = true;
    if(this.form.invalid) return;
    this.submitted = false;
    this.onSubmitUpdate();
  }

  onSubmitUpdate() {
    console.log(this.form.value);
    this.productService.updateProduct(this.form.value, this.id ).subscribe({
      next: (v) => {
        this.swal.successMessage("Producto Actualizado exitosamente"); // show message
        this.getProductDetail(); // reload products
        this.hideModalForm(); // close modal
      },
      error: (e) => {
        console.error(e);
        this.swal.errorMessage("No se pudo actualizar el producto vuelvalo a intentar mas tarde"); // show message
      }
    });
  }

  updateProducto(product:Product):void{
    this.form.reset();
    this.form.controls['product'].setValue(product.product);
    this.form.controls['gtin'].setValue(product.gtin);
    this.form.controls['description'].setValue(product.description);
    this.form.controls['price'].setValue(product.price);
    this.form.controls['stock'].setValue(product.stock);
    this.form.controls['category_id'].setValue(product.category_id);
    this.submitted = false;
    $("#modalForm").modal("show");
  }

  newImage($event:any){
    console.log("Se ha llegado");
    this.ngxService.open($event, {
      aspectRatio: 1/1,
      autoCropArea: 1,
      resizeToWidth: 360,
      resizeToHeight: 360,
    }).subscribe(data => {
      this.saveProductImage(data.base64!);
    });
  }

  saveProductImage(image:string){
    let productImage: ProductImage = new ProductImage();
    productImage.image = image;
    productImage.product_id = this.id;
    console.log(productImage);
    this.productImageService.uploadProductImage(productImage).subscribe({
      next: (v) => {
        this.swal.successMessage("Imagen guardada exitosamente");
        this.getProductDetail();
      },
      error: (e) => {
        console.error(e);
        this.swal.errorMessage("No se pudo guardar la imagen del producto");
      }
    });
  }

 
  
  deleteProductImage(id: number):void{
    this.swal.confirmMessage.fire({
      title: "¿Está seguro de eliminar la imagen?",
    }).then((result) => {
      if (result.isConfirmed) {
        this.productImageService.deleteProductImage(id).subscribe({
          next: (v) => {
            this.swal.successMessage("La imagen ha sido eliminada");
            this.getProductDetail();
          },
          error: (e) => {
            this.swal.errorMessage("No se pudo eliminar la imagen");
          }
        
        });
      }
    });
  }

  updateImage($event:any, id:number){
    event?.stopPropagation();
    this.ngxService.open($event, {
      aspectRatio: 1/1,
      autoCropArea: 1,
      resizeToWidth: 360,
      resizeToHeight: 360,
    }).subscribe(data => {
      this.updateProductImage(data.base64!,id);
    });
  }

  updateProductImage(image:string, id:number){
    let productImage: ProductImage = new ProductImage();
    productImage.product_image_id = id;
    productImage.image = image;
    productImage.product_id = this.id;
    this.deleteProductImage(id);
    this.productImageService.uploadProductImage(productImage).subscribe({
      next: (v) => {
        this.getProductDetail();
        this.swal.successMessage("Imagen actualizada exitosamente");
      },
      error: (e) => {
        console.error(e);
        this.swal.errorMessage("No se pudo actualizar la imagen del producto");
      }
    });
  }

}


