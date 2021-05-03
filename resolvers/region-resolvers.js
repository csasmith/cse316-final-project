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
            if (!userId) return ({});
            const maps = await Region.find({ owner: userId, parent: "" });
            if (maps) return maps;
            return ({});
        },
        getRegionById: async (_, args) => {
            const { _id } = args;
			const objId = new ObjectId(_id);
            const region = await Region.findOne({ _id: objId });
            if (region) return region;
            return ({});
        }
    },
    Mutation: {
        addSubregion: async (_, args, { req }) => {
            const { subregion } = args;
            const { name, parent } = subregion;
            console.log("addSubregion name: " + name + ", parent: " + parent);
            const existing = Region.findOne({name: name, parent: ""});
            // this seems outside the spec...
            if (existing) {
                return "Error:Dup";
            }
            const objId = new ObjectId();
            const newRegion = new Region({
                _id: objId,
                owner: req.userId,
                name: name,
                parent: parent,
                subregions: [],
                capital: "None",
                leader: "None",
                landmarks: []
            });
            const updated = await newRegion.save();
            console.log("New region: " + updated);
            if (updated) return objId;
            return "Error:DB";
        },
        deleteSubregion: async (_, args) => {
            // Undo needs to return to original index!
            return 'delete subregion';
        },
        changeSubregionParent: async (_, args) => {
            return "change subregion parent"
        },
        setRegionField: async (_, args) => {
            return 'set region field';
        }
    }
}