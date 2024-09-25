import { Component } from '@angular/core';
import { CategoryService } from '../../_service/category.service';
import { Category } from '../../_model/category';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import { SharedModule } from '../../../../shared/shared-module';



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
    categoryform: ['', Validators.required],
    tagform: ['', Validators.required],
  });
  

  submitted = false;
  
  constructor(private categoryService: CategoryService, private formBuilder: FormBuilder) {
    
  }


  
  ngOnInit(){
    this.categories = this.categoryService.getCategories();
  }

  getCategories():void{
    this.categories = this.categoryService.getCategories();
  }

  showModalForm(){
    $("#modalForm").modal("show");
    this.form.reset();
  }



  hideModalForm(){
    $("#modalForm").modal("hide");
  }


}
