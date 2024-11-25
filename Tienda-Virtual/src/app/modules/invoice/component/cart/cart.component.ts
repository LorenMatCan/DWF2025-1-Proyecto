import { Component } from '@angular/core';
import { SharedModule } from '../../../../shared/shared-module';
import { CartService } from '../../_service/cart.service';
import { DtoCartDetails } from '../../_dto/dto-cart-details';
import { SwalMessages } from '../../../../shared/swal-messages';
import { ProductComponent } from '../../../product/component/product/product.component';
import { ProductService } from '../../../product/_service/product.service';
import { InvoiceService } from '../../_service/invoice.service';





@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {


  products: DtoCartDetails[] = []; // product list
  total: number = 0; // total price
  current_date = new Date(); // hora y fecha actual
  swal: SwalMessages = new SwalMessages(); // swal messages

  constructor(

    private productService: ProductService,
    private cartService: CartService,
    private invoiceService: InvoiceService,

  ){}

  ngOnInit(){
    this.getCart();
    this.getTotal();
  }

  getCart(){
    this.cartService.getCart().subscribe({
      next: (v) => {
        this.products = v;
        for (let i = 0; i < this.products.length; i++){
          this.products[i].total = this.products[i].product.price * this.products[i].quantity;
          this.total += this.products[i].total;
          if (this.products[i].image == "data:image/png;base64,"){
            this.products[i].image = "";
        }
      }
        console.log(this.products);
      },
      error: (e) => {
        console.log(e);
        this.swal.errorMessage(e.error!.message); // show message
      }
    });
  }

  getTotal(){
    this.total = 0;
    for (let i = 0; i < this.products.length; i++){
      this.products[i].total = this.products[i].product.price * this.products[i].quantity;
      this.total += this.products[i].total;
    }
  }

  checkout(){
    this.swal.confirmMessage.fire({
      title: "¿Está seguro de realizar la compra?",
    }).then((result) => {
      if (result.isConfirmed) {
        this.invoiceService.generateInvoice().subscribe({
          next: (v) => {
            this.swal.successMessage("Compra realizada exitosamente");
            this.cartService.clearCart().subscribe({
              next: (v) => {
                this.swal.successMessage("Carrito limpiado exitosamente");
                this.getCart();
              }
            });
            window.location.reload();
          },
          error: (e) => {
            console.log(e);
            this.swal.errorMessage(e.error!.message); // show message
          }
        });
      }
    });
  }

  removeProduct(id : number){
    this.swal.confirmMessage.fire({
      title: "¿Está seguro de eliminar el producto del carrito?",
    }).then((result) => {
      if (result.isConfirmed) {
        this.removeFromCart(id);
      }
    });

  }

  removeFromCart(id: number){
    this.cartService.removeFromCart(id).subscribe({
      next: (v) => {
        this.swal.successMessage("Producto eliminado del carrito");
        this.getCart();
        window.location.reload();
        
      },
      error: (e) => {
        console.log(e);
        this.swal.errorMessage(e.error!.message); // show message
      }
    });
  }




  clearCart(){
    this.swal.confirmMessage.fire({
      title: "¿Está seguro de limpiar el carrito?",
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.clearCart().subscribe({
          next: (v) => {
            this.swal.successMessage("Carrito limpiado exitosamente");
            this.getCart();
            window.location.reload();
          },
          error: (e) => {
            console.log(e);
            this.swal.errorMessage(e.error!.message); // show message
          }
        });
      }
    });

  }

  

 


}
