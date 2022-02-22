const mongoose = require('mongoose');

const User = require('./userDetails')

const EventsSchema = new mongoose.Schema({
  name:{
    type: String,
    required:true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user'
},
  type: {
    type: String,

  },
  information: {
    type: String,
  },
  invited:[{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
  address:{
    type:String,
  },
  Details:{
    type:String,
  }
},{ collection: 'events' },{
    timestamps:true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}
);


module.exports = Event = mongoose.model('events', EventsSchema);