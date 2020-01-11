const graphql = require('graphql');
const axios = require('axios');

const {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLSchema,
} = graphql;

const ChapterType = new GraphQLObjectType ({
  name: 'Chapters',
  fields: () => ({
    id: { type: GraphQLString },
    originalName: { type: GraphQLString },
    currentName: { type: GraphQLString },
    warcry: { type: GraphQLString },
    founding: { type: GraphQLString },
    successorsOf: { type: GraphQLString },
    successorChapters: { type: GraphQLString },
    homeworld: { type: GraphQLString },
    allegiance: { type: GraphQLString },
    marines: {
      type: new GraphQLList(MarinesType),
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/chapters/${parentValue.id}/marines`)
        .then(res => res.data);
      }
    },
  })
})

const MarinesType = new GraphQLObjectType ({
  name: 'Marines',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    chapter: { 
      type: ChapterType ,
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/chapters/${parentValue.chapterId}`)
          .then(res => res.data);
      }
    },
    chapterId: { type: GraphQLString },
    rank: { type: GraphQLString },
    company: { type: GraphQLInt },
    squad: { type: GraphQLInt },
    veterancy: { type: GraphQLBoolean },
    specialisation: { type: GraphQLString },
    primaris: { type: GraphQLBoolean },
    alive: { type: GraphQLBoolean },
  })
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
    },
    chapter: {
      type: ChapterType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
          return axios.get(`http://localhost:3000/chapters/${args.id}`)
            .then(resp => resp.data);
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addMarine: {
      type: MarinesType,
      args: {
        id: { type: GraphQLString },
        firstName: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, { firstName }) {
        return axios.post('http://localhost:3000/marines', { firstName })
          .then(res => res.data);
      }
    },
    deleteMarine: {
      type: MarinesType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, { id }) {
        return axios.delete(`http://localhost:3000/marines/${id}`)
          .then(res => res.data);
      }
    },
    editMarine: {
      type: MarinesType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        rank: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        return axios.patch(`http://localhost:3000/marines/${args.id}`, args)
          .then(res => res.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});