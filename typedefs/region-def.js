const { gql } = require('apollo-server');

const typeDefs = gql`
    type Region {
        _id: String
        owner: String
        path: String
        name: String
        capital: String
        leader: String
        landmarks: [String]
        index: String
    }
    extend type Query {
        getAllMaps: [Region]
        getRegionById(_id: String!): Region
        getSubregions(_id: String!): [Region]
        getChildrenLandmarks(_id: String): [String]
        getThisRegionLandmarks(_id:String): [String]
    }
    extend type Mutation {
        addSubregion(subregion: RegionInput!): String
        deleteSubregion(_id: String!): Region
        changeSubregionParent(subregion_id: String!, newParent_id: String!): String
        setRegionField(_id: String!, field: String!, val: String!): String
    }
    input RegionInput {
        _id: String
        owner: String
        path: String
        name: String
        capital: String
        leader: String
        landmarks: [String]
        index: String
    }
`;

module.exports = { typeDefs: typeDefs };