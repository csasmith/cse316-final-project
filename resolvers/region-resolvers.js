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
            const maps = await Region.find({ owner: userId, parent: "" });
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
        }
    },
    Mutation: {
        addSubregion: async (_, args, { req }) => {
            const { subregion } = args;
            const { name, parent } = subregion;
            console.log("addSubregion name: " + name + ", parent: " + parent);
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
            // now add newRegion to parent if parent exists
            // should parent be turned into an ObjectId?
            // LOOKS LIKE NEW REGION SAVED SUCCESSFULLY, BUT NOT BEING ADDED TO PARENT ARRAY 
            let updatedParent = {};
            if (parent !== "") {
                parentId = new ObjectId(parent);
                const parentRegion = await Region.findById(parentId);
                console.log("Parent region: " + parentRegion);
                let subregions = parentRegion.subregions;
                console.log("oldSubregions: " + subregions);
                subregions.push(newRegion);
                console.log("newSubregions: " + subregions);
                updatedParent = await Region.findByIdAndUpdate(parentId, { subregions: subregions });
                console.log("updatedParent: " + updatedParent);
            }
            if (updated && updatedParent) return objId;
            return "Error:DB";
        },
        deleteSubregion: async (_, args) => {
            const { _id } = args;
            console.log('id to delete: ' + _id);
            let objId = new ObjectId(_id);
            const deletedDoc = await Region.findByIdAndDelete(objId);
            if (deletedDoc) {
                console.log(deletedDoc);
            }
            return objId;
        },
        changeSubregionParent: async (_, args) => {
            return "change subregion parent"
        },
        setRegionField: async (_, args) => {
            const { _id, field, val } = args;
            console.log(_id, field, val);
            let objId = new ObjectId(_id);
            const updatedDoc = await Region.findByIdAndUpdate(objId, { name: val });
            console.log(updatedDoc);
            return val;
        }
    }
}