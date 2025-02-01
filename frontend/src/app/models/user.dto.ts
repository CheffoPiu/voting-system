export class UserDTO {
    id?: number; // El ID puede ser opcional porque se genera en la BD
    cedula: string;
    nombre: string;
    apellido: string;
    email: string;
    password?: string; // Opcional si no se envía en la respuesta
    rol: string;
  
    constructor(
      cedula: string,
      nombre: string,
      apellido: string,
      email: string,
      rol: string,
      id?: number,
      password?: string
    ) {
      this.id = id;
      this.cedula = cedula;
      this.nombre = nombre;
      this.apellido = apellido;
      this.email = email;
      this.password = password;
      this.rol = rol;
    }
  }
  