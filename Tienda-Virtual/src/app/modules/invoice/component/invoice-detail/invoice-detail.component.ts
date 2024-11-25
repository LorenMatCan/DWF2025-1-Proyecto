import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Invoice } from '../../_model/invoice';
import { SwalMessages } from '../../../../shared/swal-messages';
import { InvoiceService } from '../../_service/invoice.service';
import { CustomerService } from '../../../customer/_service/customer.service';
import { SharedModule } from '../../../../shared/shared-module';

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [ SharedModule],
  templateUrl: './invoice-detail.component.html',
  styleUrl: './invoice-detail.component.css'
})
export class InvoiceDetailComponent {

  id: number = 0; // invoice id
  invoice: Invoice = new Invoice();
  nombre: string = ''; 
  fecha: string = '';
  hora: string = '';
  total: number = 0;
  subtotal: number = 0;
  taxes: number = 0;

  loading = false; // loading request
  swal: SwalMessages = new SwalMessages(); // swal messages

  constructor(
    private invoiceService: InvoiceService,
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService
  ){}

  ngOnInit(){
    this.id = +this.route.snapshot.paramMap.get('id')!;
    if(this.id){
      this.getInvoice();
    }else{
      this.swal.errorMessage("El id de la factura es inválido"); 
    }
  }

  getInvoice(){
    this.loading = true;
    this.invoiceService.getInvoice(this.id).subscribe({
      next: (v) => {
        this.invoice = v;
        this.loading = false;
        this.getNombre(this.invoice.rfc);
        this.getFecha();

        console.log(this.invoice);
      },
      error: (e) => {
        console.error(e);
        this.loading = false;
      }
    });
  }

  redirect(url:String[]){
    this.router.navigate(url); 
  }

  getNombre(rfc: string){
    this.customerService.getCustomer(rfc).subscribe({
      next: (v) => {
        console.log(v);
        this.nombre = v.name+" "+v.surname;
      },
      error: (e) => {
        console.error(e);
      }
    });

  }

  getFecha(){
    this.fecha = this.invoice.created_at.split("T")[0];
    this.hora = this.invoice.created_at.split("T")[1];
  };



}
