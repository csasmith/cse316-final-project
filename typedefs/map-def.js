const { gql } = require('apollo-server');

const typeDefs = gql`
    type Map {
        _id: String!
        name: String!
        owner: String!
        regions: [Region]
    }
    extend type Query {
        getAllMaps: [Map]
        getMapById(_id: String): Map
    }
    extend type Mutation {
        addMap(map: MapInput!): String
        deleteMap(_id: String!): String
        setMapName(_id: String!, name: String!): String
    }
    input MapInput {
        _id: String
        name: String
        owner: String
        regions: [Regions]
    }
`;

module.exports({ typeDefs: typeDefs });