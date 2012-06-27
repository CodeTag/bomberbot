module.exports = function(mongoose) {
  var collection = 'Partida';
  var Schema = mongoose.Schema;
  var ObjectId = Schema.ObjectId;

  /**
    * Model: Partida
    *
    * partidas jugadas.
    */
  console.log(mongoose.models);

  Partida = new Schema({
    jugadores: [mongoose.model("User").schema],
    logPartida: { type: String, index: false },
    fecha: { type: Date, index: true },
    id:{type: Number, index:true}
  });
  return mongoose.model(collection, Partida);
};