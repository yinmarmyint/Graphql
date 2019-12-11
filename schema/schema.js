const graphql = require("graphql");
const _ = require("lodash");
const mongoose = require("mongoose");
const Book = require("./../models/book");
const Author = require("./../models/author");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList
} = graphql;

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        if (mongoose.Types.ObjectId.isValid(parent.authorId)) {
          return Author.findById({ _id: parent.authorId });
        }
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
        return Book.find({ authorId: parent.authorId });
        // return _.filter(books, { authorId: parent.id });
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
        return Book.findById(args.id);
        // return _.find(books, { id: args.id });
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
        return Author.findById(args.id);
        // return _.find(authors, { id: args.id });
      }
    },
    getBookByAuthor: {
      type: new GraphQLList(BookType),
      args: {
        authorId: {
          type: GraphQLID
        }
      },
      resolve(parent, args) {
        return Book.find({ authorId: args.authorId });
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        // return books;
        return Book.find().limit(10);
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      args: {
        page: {
          type: GraphQLInt
        }
      },
      resolve(parent, args) {
        var pageLimit = 10,
          page = Math.max(0, args.page);
        return Author.find()
          .limit(pageLimit)
          .skip(pageLimit * page);
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString },
        gender: { type: GraphQLString },
        age: { type: GraphQLInt }
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age,
          gender: args.gender
        });
        return author.save();
      }
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        authorId: { type: GraphQLID }
      },
      resolve(parent, args) {
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId
        });
        return book.save();
      }
    },
    removeBook: {
      type: BookType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve(parent, args) {
        const removeBook = Book.findByIdAndDelete(args.id).exec();
        if (!removeBook) {
          throw new Error("Error");
        }
        return removeBook;
      }
    },
    removeAuthor: {
      type: BookType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve(parent, args) {
        const removeAuthor = Author.findByIdAndDelete(args.id).exec();
        if (!removeAuthor) {
          throw new Error("Error");
        }
        return removeAuthor;
      }
    },
    updateAuthor: {
      type: AuthorType,
      args: {
        id: {
          name: "id",
          type: new GraphQLNonNull(GraphQLString)
        },
        name: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve(parent, args) {
        return Author.findByIdAndUpdate(
          args.id,
          { $set: { name: args.name } },
          { new: true }
        ).catch(err => new Error(err));
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
