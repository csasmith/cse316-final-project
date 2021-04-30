const { model, Schema, ObjectId } = require('mongoose');
const Region = require('./region-model').schema;

const mapSchema = new Schema(
	{
        _id: { type: ObjectId, required: true },
        name: { type: String, required: true },
        owner: { type: String, required: true },
        regions: [Region] // this one might not be necessary... can just go thru parents in regions?
        // ok actually maybe we do need it, how else load top level regions after clicking on map?
    }, 
    { timestamp: true }
);

const Map = model('Map', mapSchema);
module.exports = Map;