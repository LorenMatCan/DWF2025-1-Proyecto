import Swal from "sweetalert2";



export class SwalMessages{


    // muestra mensaje de confirmación
    successMessage(message: string){
        if (message === null || message === undefined) {
            message = "Hubo un error en la operación";
        }
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            toast: true,
            text: message,
            background: '#E8F8F8',
            showConfirmButton: false,
            timer: 2000
        });
    }
   
    // muestra mensaje de error
    errorMessage(message: string){
        Swal.fire({
            position: 'top-end',
            icon: 'error',
            toast: true,
            text: message,
            background: '#F8E8F8',
            showConfirmButton: false,
            timer: 2000
        });
    }
}
