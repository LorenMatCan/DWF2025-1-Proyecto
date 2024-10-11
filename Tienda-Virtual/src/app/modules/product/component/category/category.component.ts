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

  categories: Category[]= [];

 
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
    this.categories = this.categoryService.getCategories();
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

    let id = this.categories.length + 1; 
    let region = new Category(id, this.form.controls['category'].value!, this.form.controls['tag'].value!, 1);
    this.categories.push(region);

    this.hideModalForm();
    this.swal.successMessage("La categoria ha sido registrada")


  }


  hideModalForm(){
    $("#modalForm").modal("hide");
  }


}
