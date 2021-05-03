const { model, Schema, ObjectId } = require('mongoose');

const regionSchema = new Schema(
    {
        _id: { type: ObjectId, required: true },
        owner: { type: String, required: true },
        name: { type: String, required: true },
        capital: { type: String, required: true },
        leader: { type: String, required: true },
        landmarks: { type: [String], required: true }
    }, 
    { timestamp: true }
);

regionSchema.add(
    {
        parent: String, // could make this id instead
        subregions: { type: [regionSchema], required: true } // could also make these ids?
    }
);

const Region = model('Region', regionSchema);
module.exports = Region;

/**
 * For recursive schema definition try
 
 var Tasks = new Schema();
 Tasks.add({
    title     : String,
    subtasks  : [Tasks]
 });

 from https://stackoverflow.com/questions/33825773/recursive-elements-in-schema-mongoose-modelling
 */