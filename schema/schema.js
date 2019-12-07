const graphql = require("graphql");
const _ = require("lodash");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList
} = graphql;

const books = [
  { name: "The river", genre: "Fantasy", id: "1", authorId: "1" },
  { name: "Monkey", genre: "Si=Fi", id: "2", authorId: "1" },
  { name: "Apple Inc", genre: "Biography", id: "3", authorId: "2" },
  { name: "Steve Jobs", genre: "Biography", id: "4", authorId: "3" }
];

const authors = [
  { name: "Jowe Jowe", gender: "M", age: "25", id: "1" },
  { name: "Kaio Kaio", gender: "M", age: "28", id: "2" },
  { name: "Ju Ju ", gender: "F", age: "28", id: "3" },
  { name: "Gu Gu", gender: "F", age: "25", id: "4" }
];

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        // return _.find(authors, { id: parent.authorId });
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    gender: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return _.filter(books, { authorId: parent.id });
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    book: {
      type: BookType,
      args: {
        id: {
          type: GraphQLID
        }
      },
      resolve(parent, args) {
        return _.find(books, { id: args.id });
      }
    },
    author: {
      type: AuthorType,
      args: {
        id: {
          type: GraphQLID
        }
      },
      resolve(parent, args) {
        return _.find(authors, { id: args.id });
      }
    },
    books: {
      type: GraphQLList(BookType),
      resolve(parent, args) {
        return books;
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
