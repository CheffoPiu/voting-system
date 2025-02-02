const mongoose = require('mongoose');

const voteLogSchema = new mongoose.Schema({
    userId: { type: Number, required: true }, 
    candidateId: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }, // Fecha del voto
    userAgent: { type: String }, // Información del navegador/dispositivo
    ipAddress: { type: String }, // IP del usuario
    status: { type: String, enum: ['SUCCESS', 'FAILED'], default: 'SUCCESS' }, // Estado del voto
});

const VoteLog = mongoose.model('VoteLog', voteLogSchema);

module.exports = VoteLog;
