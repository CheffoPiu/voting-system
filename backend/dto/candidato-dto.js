class CandidatoDTO {
    constructor(candidato) {
        this.id = candidato.id;
        this.cedula = candidato.cedula;
        this.nombre = candidato.nombre;
        this.apellido = candidato.apellido;
        this.partido = candidato.partido;
        this.numeroLista = candidato.numeroLista;
    }
}

module.exports = CandidatoDTO;
