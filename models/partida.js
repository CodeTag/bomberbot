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
//jugadores: [mongoose.model("User").schema],
  Partida = new Schema({
    
    logPartida: { type: String, index: false },
    fecha: { type: Date, index: true, default: Date.now },
    id:{type: Number, index:true}
  });
  return mongoose.model(collection, Partida);
};