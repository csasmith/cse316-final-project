const ObjectId = require('mongoose').Types.ObjectId;
const Region = require('../models/region-model');

module.exports = {
    Query: {
        /**
         * @param {*} req request object from context 
         * @returns 
         */
        getAllMaps: async (_, __, { req }) => {
            const userId = new ObjectId(req.userId);
            console.log("userId: " + userId);
            if (!userId) return ({});
            const maps = await Region.find({ owner: userId, path: null }).sort({ index: 'asc'}); // might mess with required bit
            // console.log("maps: " + maps);
            if (maps) return maps;
            return ({});
        },
        getRegionById: async (_, args) => {
            const { _id } = args;
            // console.log("what is args? :" + JSON.stringify(args));
            // console.log("what is id? :" + JSON.stringify(_id));
			const objId = new ObjectId(_id);
            const region = await Region.findOne({ _id: objId });
            // console.log("what is region? " + JSON.stringify(region));
            if (region) {
                return (region);
            }
            return ({});
        },
        getSubregions: async (_, args) => {
            const { _id } = args;
            const regexp = _id + '$'; // string ends with _id
            console.log('regex for getSubregions: ' + regexp);
            const subregions = await Region.find({ path: { $regex: regexp }}).sort({ index: 'asc' });
            console.log('subregions: ' + subregions);
            if (subregions) {
                return (subregions);
            }
            return ([]);
        }
    },
    Mutation: {
        addSubregion: async (_, args, { req }) => {
            const { subregion } = args;
            const { _id, owner, path, name, capital, leader, landmarks, index } = subregion;
            console.log(subregion);
            const objId = _id ? new ObjectId(_id) : new ObjectId();
            const newRegion = new Region({
                _id: objId,
                owner: req.userId,
                path: path,
                name: name,
                capital: capital,
                leader: leader,
                landmarks: landmarks,
                index: index
            });
            const updated = await newRegion.save();
            console.log("New region: " + updated);
            // now add newRegion to parent if parent exists
            // should parent be turned into an ObjectId?
            // LOOKS LIKE NEW REGION SAVED SUCCESSFULLY, BUT NOT BEING ADDED TO PARENT ARRAY 

            if (updated) return objId;
            return "Error:DB";
        },
        deleteSubregion: async (_, args) => {
            const { _id } = args;
            console.log('id to delete: ' + _id);
            let objId = new ObjectId(_id);
            const deletedDoc = await Region.findByIdAndDelete(objId);
            if (deletedDoc) {
                console.log(deletedDoc);
                return (deletedDoc);
            }
            return ([]);
        },
        changeSubregionParent: async (_, args) => {
            return "change subregion parent"
        },
        setRegionField: async (_, args) => {
            const { _id, field, val } = args;
            console.log(_id, field, val);
            let objId = ObjectId(_id);
            const updatedDoc = await Region.findByIdAndUpdate(objId, { [field]: val });
            console.log(updatedDoc);
            return val;
        }
    }
}