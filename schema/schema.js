const graphql = require('graphql');
const axios = require('axios');

const {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLString,
  GraphQLSchema,
} = graphql;

const MarinesType = new GraphQLObjectType ({
  name: 'Marines',
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    chapter: { type: GraphQLString },
    chapterId: { type: GraphQLString },
    rank: { type: GraphQLString },
    company: { type: GraphQLInt },
    squad: { type: GraphQLInt },
    veterancy: { type: GraphQLBoolean },
    specialisation: { type: GraphQLString },
    primaris: { type: GraphQLBoolean },
    alive: { type: GraphQLBoolean },
  }
})

const ChapterType = new GraphQLObjectType ({
  name: 'Chapters',
  fields: {
    id: { type: GraphQLString },
    originalName: { type: GraphQLString },
    currentName: { type: GraphQLString },
    warcry: { type: GraphQLString },
    founding: { type: GraphQLString },
    successorsOf: { type: GraphQLString },
    successorChapters: { type: GraphQLString },
    homeworld: { type: GraphQLString },
    allegiance: { type: GraphQLString },
  }
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    marine: {
      type: MarinesType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
          return axios.get(`http://localhost:3000/marines/${args.id}`)
            .then(resp => resp.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});