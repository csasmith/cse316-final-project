const { gql } = require('apollo-server');

// might need a move sub region mutation...

const typeDefs = gql`
    type Region {
        _id: String!
        map: String!
        name: String!
        parent: String!
        subregions: [Region]
        capital: String!
        leader: String!
        landmarks: [String!]!
    }
    extend type Query {
        getRegionById(_id: String): Region
    }
    extend type Mutation {
        addSubregion(subregion: RegionInput!): String
        deleteSubregion(_id: String!): String
        setRegField (_id: String!, field: String!, val: String!): String
    }
    input RegionInput {
        map: String
        parent: String
    }
`;

module.exports({ typeDefs: typeDefs });