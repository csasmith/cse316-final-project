const ObjectId = require('mongoose').Types.ObjectId;
const Region = require('../models/region-model');

module.exports = {
    Query: {
        getRegionById: async (_, args) => {
            const { _id } = args;
			const objId = new ObjectId(_id);
            const region = await Region.findOne({ _id: objId });
            if (region) return region;
            return ({});
        }
    },
    Mutation: {
        addSubRegion: async (_, args) => {
            const { _id, subregion, map, parent } = args;
            console.log(args);

            
        }
    }
}