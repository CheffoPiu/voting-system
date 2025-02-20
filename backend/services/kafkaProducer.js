const kafka = require('kafka-node');

const client = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_BROKER || "192.168.100.53:9092" });
const producer = new kafka.Producer(client);

producer.on("ready", () => {
  console.log("✅ Kafka Producer está listo.");
});

producer.on("error", (err) => {
  console.error("❌ Error en Kafka Producer:", err);
});

/**
 * Envía un mensaje a Kafka
 * @param {string} topic - Nombre del topic en Kafka
 * @param {Object} message - Mensaje a enviar
 */
const sendKafkaMessage = (topic, message) => {
    const payloads = [{ topic, messages: JSON.stringify(message), partition: 0 }];
  
    console.log("📤 Enviando a Kafka:", JSON.stringify(payloads, null, 2)); // 👈 Agregar log
  
    producer.send(payloads, (err, data) => {
      if (err) {
        console.error("❌ Error enviando mensaje a Kafka:", err);
      } else {
        console.log("📩 Mensaje enviado a Kafka con éxito:", JSON.stringify(data, null, 2));
      }
    });
  };

module.exports = sendKafkaMessage;
