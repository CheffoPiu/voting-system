export class CandidatoDTO {
    id?: number; // El ID solo se usa para edición, se genera automáticamente en la creación
    cedula: string;
    nombre: string;
    apellido: string;
    partido: string;
    numeroLista: number;
  
    constructor(data: any) {
      this.id = data.id;
      this.cedula = data.cedula;
      this.nombre = data.nombre;
      this.apellido = data.apellido;
      this.partido = data.partido;
      this.numeroLista = data.numero_Lista;
    }
  }
  