export {}
const PlacesModel = require('./place_model');
const graphl = require('graphql');
const graphqlIsoDate = require('graphql-iso-date');

//Destructure types from graphl
const {
    GraphQLID, GraphQLInt, GraphQLString,
    GraphQLObjectType, GraphQLSchema, GraphQLList
} = graphl;


//Destructure date-time type from graphql-iso-date
const { GraphQLDateTime } = graphqlIsoDate;

//Define place types
const PlaceType = new GraphQLObjectType({
    name: "Place",
    fields: {
        id: { type: GraphQLID },
        userId: { type: GraphQLString },
        name: { type: GraphQLString },
        placeId: { type: GraphQLString },
        vicinity: { type: GraphQLString },
        lat: { type: GraphQLString },
        lng: { type: GraphQLString },
        rating: { type: GraphQLString },
        userRating: { type: GraphQLInt },
        icon: { type: GraphQLString },
        createdAt: { type: GraphQLDateTime }
    }
});


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
       places: {
           type: new GraphQLList(PlaceType),
           resolve(parent: any, args: any){
               //Retrieve data from database
              return PlacesModel.find().exec();  
           }
       },
       place: {
           type: new GraphQLList(PlaceType),
           args: { id: {type: GraphQLString} },
           resolve(parent: any, args: any) {
                return PlacesModel.find({ userId: args.id }).sort({ createdAt: -1 })
           }
       }
    }
})



module.exports = new GraphQLSchema({
    query: RootQuery
});