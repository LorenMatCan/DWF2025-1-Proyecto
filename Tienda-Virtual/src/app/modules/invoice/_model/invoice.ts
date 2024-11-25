/* REQUERIMIENTO 5. Implementar modelo Invoice */
import { Item } from './item'; 
import { Customer } from '../../customer/_model/customer';
export class Invoice{
    created_at: string = " ";
    invoice_id: number= 0;
    items: Item[]= [];
    subtotal: number = 0;
    taxes: number = 0;
    total: number = 0;
    rfc = "";
}




