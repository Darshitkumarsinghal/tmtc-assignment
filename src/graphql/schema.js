const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList, GraphQLID } = require("graphql");
const Itinerary = require("../models/Itinerary");

const ActivityType = new GraphQLObjectType({
  name: "Activity",
  fields: {
    time: { type: GraphQLString },
    description: { type: GraphQLString },
    location: { type: GraphQLString },
  },
});

const ItineraryType = new GraphQLObjectType({
  name: "Itinerary",
  fields: {
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    destination: { type: GraphQLString },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
    activities: { type: new GraphQLList(ActivityType) },
  },
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    itineraries: {
      type: new GraphQLList(ItineraryType),
      resolve(parent, args) {
        return Itinerary.find();
      },
    },
    itinerary: {
      type: ItineraryType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Itinerary.findById(args.id);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
