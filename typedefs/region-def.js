const { gql } = require('apollo-server');

// might need a mutation if sending active map to top needs to be persistent... ugh
// might need to change return type of deleteSubregion

const typeDefs = gql`
    type Region {
        _id: String!
        owner: String!
        name: String!
        parent: String
        subregions: [Region!]
        capital: String!
        leader: String!
        landmarks: [String!]
    }
    extend type Query {
        getAllMaps: [Region]
        getRegionById(_id: String): Region
        getChildrenLandmarks(_id: String): [String]
        getThisRegionLandmarks(_id:String): [String]
    }
    extend type Mutation {
        addSubregion(subregion: RegionInput!): String
        deleteSubregion(_id: String!): String
        changeSubregionParent(subregion_id: String!, newParent_id: String!): String
        setRegionField(_id: String!, field: String!, val: String!): String
    }
    input RegionInput {
        name: String
        parent: String
    }
`;

module.exports = { typeDefs: typeDefs };