module.exports = function(mongoose) {
  var collection = 'Partida';
  var Schema = mongoose.Schema;
  var ObjectId = Schema.ObjectId;

  /**
    * Model: Partida
    *
    * partidas jugadas.
    */
    //
  console.log(mongoose.models);
  Partida = new Schema({
    fecha: { type: Date, index: true, default: Date.now },
    jugadorA: {type:String, index:false},
    jugadorB: {type:String, index:false},
    jugadorC: {type:String, index:false},
    jugadorD: {type:String, index:false},
    logPartida: { type: String, index: false }
  });
  return mongoose.model(collection, Partida);
};