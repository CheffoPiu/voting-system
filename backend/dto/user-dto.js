class UserDTO {
    constructor(user) {
        this.id = user.id;
        this.cedula = user.cedula;
        this.nombre = user.nombre;
        this.apellido = user.apellido;
        this.email = user.email;
        this.rol = user.rol || 'USER'; // Valor por defecto si no se envía
    }
}

module.exports = UserDTO;
