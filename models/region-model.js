const { model, Schema, ObjectId } = require('mongoose');

const regionSchema = new Schema(
    {
        _id: { type: ObjectId, required: true },
        map: { type: String, required: true },
        name: { type: String, required: true },
        parent: { type: this, required: true },
        subregions: { type: [this], required: true },
        capital: { type: String, required: true },
        leader: { type: String, required: true },
        landmarks: { type: [String], required: true }
    }, 
    { timestamp: true }
);

const Region = model('Region', regionSchema);
module.exports = Region;