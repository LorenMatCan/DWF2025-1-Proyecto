import { Component } from '@angular/core';
import { CategoryService } from '../../_service/category.service';
import { Category } from '../../_model/category';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import { SharedModule } from '../../../../shared/shared-module';
import { SwalMessages } from '../../../../shared/swal-messages';



declare var $: any;

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
  standalone: true,
  imports: [SharedModule],
})


export class CategoryComponent {

  categories: any = [];

  updated: number = 0; 

 
    form = this.formBuilder.group({
      category: ["",[Validators.required]],
      tag: ["",[Validators.required]],
    });
  

  

  submitted = false;

  swal: SwalMessages = new SwalMessages();
  
  constructor(private categoryService: CategoryService, private formBuilder: FormBuilder) {
    
  }


  
  ngOnInit(){
    this.getCategories();
  }

  getCategories():void{
    this.categoryService.getCategories().subscribe({
      next: (v) => {
        this.categories = v;
      },
      error: (e) => {
        this.swal.errorMessage("Hubo un error de conexión");
      }
  });
  }


  enableCategory(id: number):void{
    this.swal.confirmMessage.fire({
      title: "Favor de confirmar la activación",
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.activateCategory(id).subscribe({
          next: (v) => {
            this.swal.successMessage("La categoria ha sido activada");
            this.getCategories();
          },
          error: (e) => {
            this.swal.errorMessage("No se pudo activar la categoria");
          }
        });
      }
    });
  }

  disableCategory(id: number):void{
    this.swal.confirmMessage.fire({
      title: "Favor de confirmar la activación",
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteCategory(id).subscribe({
          next: (v) => {
            this.swal.successMessage("La categoria ha sido desactivada");
            this.getCategories();
          },
          error: (e) => {
            this.swal.errorMessage("No se pudo eliminar la categoria");
          }
        
        });
      }
    });
  }

  showModalForm(){
    $("#modalForm").modal("show");
    this.form.reset();
    this.submitted=false
  }

  onSubmit():void{
    this.submitted = true;
    if(this.form.invalid) return;
    this.submitted = false;

    if (this.updated == 0) {
      this.onSubmitCreate();
    } else {
      this.onSubmitUpdate();
    }

  }

  onSubmitCreate() {
    this.categoryService.createCategory(this.form.value).subscribe({
      next: (v) => {
        this.swal.successMessage("Se ha creado la categoria"); 
        this.getCategories();
        this.hideModalForm(); 
      },
      error: (e) => {
        console.error(e);
        this.swal.errorMessage("Error, no se pudo crear la categoria, vuelvalo a intentar"); 
      }
    });
  }


  onSubmitUpdate():void{
    this.categoryService.updateCategory(this.form.value, this.updated).subscribe({
      next: (v) => {
        this.swal.successMessage("Se ha actualizado la categoria"); 
        this.getCategories();
        this.hideModalForm(); 
      },
      error: (e) => {
        console.error(e);
        this.swal.errorMessage("Error, no se pudo actualizar la categoria, vuelvalo a intentar"); 
      }
    });
  }

  updateCategory(category: Category):void{
    this.updated = category.category_id;
    this.form.reset();
    this.form.controls['category'].setValue(category.category);
    this.form.controls['tag'].setValue(category.tag);
    this.swal.successMessage("Se ha actualizado la categoria"); 
    this.submitted = false;
    $("#modalForm").modal("show");

  }

  hideModalForm(){
    $("#modalForm").modal("hide");
  }


}
