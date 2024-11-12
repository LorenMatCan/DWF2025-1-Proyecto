import { Component } from '@angular/core';
import { Region } from '../../_model/region';
import { RegionService } from '../../_service/region.service';
import { SharedModule } from '../../../../shared/shared-module';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { SwalMessages } from '../../../../shared/swal-messages';

declare var $: any; // jquery

@Component({
  selector: 'app-region',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './region.component.html',
  styleUrl: './region.component.css'
})
export class RegionComponent {

  regions:Region[] = []; // lista de regiones

  region_id = 0; // id de región a actualizar

  // formulario región
  form = this.formBuilder.group({
    region: ["", [Validators.required]],
    tag: ["", [Validators.required]],
  });

  current_date = new Date(); // hora y fecha actua

  loading = false; // loading request
  submitted = false; // form submitted

  swal: SwalMessages = new SwalMessages(); // swal messages

  constructor(
    private formBuilder: FormBuilder,
    private regionService: RegionService
  ){}

  ngOnInit(){
    this.getRegions();
  }

  disableRegion(id: number){
    this.swal.confirmMessage.fire({
      title: "Favor de confirmar la eliminación",
    }).then((result) => {
      if (result.isConfirmed) {
        this.regionService.disableRegion(id).subscribe({
          next: (v) => {
            this.swal.successMessage(v.message);
            this.getRegions();
          },
          error: (e) => {
            console.log(e);
            this.swal.errorMessage(e.error.message);
          }
        });
      }
    });

    
  }

  enableRegion(id: number){
    this.swal.confirmMessage.fire({
      title: "Favor de confirmar la activación",
    }).then((result) => {
      if (result.isConfirmed) {
        this.regionService.enableRegion(id).subscribe({
          next: (v) => {
            this.swal.successMessage(v.message);
            this.getRegions();
          },
          error: (e) => {
            console.log(e);
            this.swal.errorMessage(e.error.message);
          }
        });
      }
    });

    
  }

  getRegions(){
    this.loading = true;
    this.regionService.getRegions().subscribe({
      next: (v) => {
        // console.log(v);
        this.regions = v;
        this.loading = false;
        this.current_date = new Date();
      },
      error: (e) => {
        console.error(e);
        this.loading = false;
      }
    });

  }

  onSubmit(){

    // validación del formulario 
    this.submitted = true;
    if(this.form.invalid){ return;}
    this.submitted = false;

    // valida si se está registrando o actualizando una región
    if(this.region_id == 0){
      this.onSubmitCreate();
    }else{
      this.onSubmitUpdate();
    }

    
  }

  onSubmitCreate(){
    this.regionService.createRegion(this.form.value).subscribe({
      next: (v) => {
        this.getRegions();
        this.hideModalForm();
        this.resetVariables();
        this.swal.successMessage(v.message);
      },
      error: (e) => {
        console.log(e);
        this.swal.errorMessage(e.error.message);
      }
    });
  }

  onSubmitUpdate(){
    this.regionService.updateRegion(this.form.value, this.region_id).subscribe({
      next: (v) => {
        this.getRegions();
        this.hideModalForm();
        this.resetVariables();
        this.swal.successMessage(v.message);
      },
      error: (e) => {
        console.log(e);
        this.swal.errorMessage(e.error.message);
      }
    });
  }

  updateRegion(region: Region){
    this.resetVariables();
    this.showModalForm();

    this.region_id = region.region_id;
    this.form.controls['region'].setValue(region.region);
    this.form.controls['tag'].setValue(region.tag);
  }


  // modal 

  showModalForm(){
    $("#modalForm").modal("show");
  }

  hideModalForm(){
    $("#modalForm").modal("hide");
  }

  // aux 

  resetVariables(){
    this.form.reset();
    this.submitted = false;
    this.region_id = 0;
  }


}
