import { CommonModule } from '@angular/common';
import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-candidatos-dialog',
  standalone: true,
  imports: [
    MaterialModule,
    TablerIconsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './candidatos-dialog.component.html',
  styleUrl: './candidatos-dialog.component.scss'
})
export class CandidatosDialogComponent {

  jugadorForm: FormGroup;
  action: string;
  isLoading: boolean = false; // Estado de carga

  constructor(
    public dialogRef: MatDialogRef<CandidatosDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private toastr: ToastrService,

  ) {
    this.action = data.action;
    this.jugadorForm = this.fb.group({
      cedula: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Validar 10 dígitos
      nombre: [{ value: '', disabled: true }, [Validators.required]],
      segundoNombre: [{ value: '', disabled: true }],
      apellido: [{ value: '', disabled: true }, [Validators.required]],
      segundoApellido: [{ value: '', disabled: true }, [Validators.required]],
      numero: [{ value: '', disabled: true }, [Validators.required, Validators.pattern('^[0-9]{1,3}$')]],
      telefono: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }, [Validators.email]],
      fechaNacimiento: [{ value: '', disabled: true }, [Validators.required]],
      imageUrl: [{ value: '', disabled: true }],
      imagePathBlob: [{ value: '', disabled: true }],

    });
  }

  
  ngOnInit(): void {
    this.toastr.success('Componente cargado', 'Éxito');
    console.log("this.data.imagePath",this.data)
    this.initializeForm();
  }

  initializeForm(){
    if (this.action === 'Edit' && this.data) {
      this.jugadorForm.patchValue({
        cedula: this.data.cedula,
        nombre: this.data.nombre,
        segundoNombre: this.data.segundoNombre,
        apellido: this.data.apellido,
        segundoApellido: this.data.segundoApellido,
        numero: this.data.numero,
        telefono: this.data.telefono,
        email: this.data.email,
        fechaNacimiento: this.data.fechaNacimiento ? new Date(this.data.fechaNacimiento) : '',
        imageUrl: this.data.imageUrl,
        imagePathBlob: this.data.imageUrlblob
      });
       // Deshabilitar el campo 'cedula' si la acción es 'Edit'
      this.jugadorForm.get('cedula')?.disable();
      //this.habilitarCampos(); // Habilitar campos para edición
    }
  }

  async onCedulaBlur() {
    const cedula = this.jugadorForm.get('cedula')?.value;

    if (this.jugadorForm.get('cedula')?.valid) {
      // Aquí puedes implementar una lógica para buscar al jugador en un backend
      this.isLoading = true; // Activar loading

    } else {
    }
    this.isLoading = false; // Desactivar loading

  }

  selectFile(event: any): void {
    const file = event.target.files[0];
  
    if (file) {
      // Verificar que el tipo MIME del archivo sea una imagen
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validImageTypes.includes(file.type)) {
        console.error('Solo se permiten archivos de imagen.');
        alert('Por favor, sube un archivo de imagen válido.');
        return;
      }
  
        // Validar el tamaño máximo de 5 MB
      const maxSizeInBytes = 1 * 1024 * 1024; // 5 MB
      if (file.size > maxSizeInBytes) {
        console.error('El archivo es demasiado grande.');
        alert('El tamaño máximo permitido para la imagen es de 5 MB.');
        return;
      }

    // Procesar la imagen si pasa las validaciones
      const reader = new FileReader();
      reader.onload = () => {
        this.jugadorForm.patchValue({ imageUrl: reader.result, imagePathBlob: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }


  doAction(): void {
    if (this.jugadorForm.valid) {
      // Obtener todos los valores, incluyendo los campos deshabilitados
      const formData = this.action === 'Edit' ? this.jugadorForm.getRawValue() : this.jugadorForm.value;
  
      if (this.action !== "Edit") {
        console.log("this.jugadorForm", formData);
        console.log("this.jugadorFormAction", this.action);
        this.dialogRef.close({ event: this.action, data: formData });
      } else {
        // Enviar el ID adicionalmente para identificar el jugador a editar
        this.dialogRef.close({ event: this.action, data: formData, dataId: this.data.id });
      }
    }
  }

  deleteJugador(){
    console.log("this.jugadorFormAction",this.action)
    this.dialogRef.close({ event: this.action, data: this.data.id });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
  
}
