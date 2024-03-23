//Create the type definitions for the query and our data

export const typeDefs = `#graphql
  type Comic {
    id: Int
    title: String
    description: String
    dates: [ComicDate]
    images: [Image]
    prices: [Price]
  }

  type Query {
    comics(pageNum: Int!): [Comic]
    comic(id: Int!): Comic
    totalComics: Int
  }

  type ComicDate {
    type: String
    date: String
  }

  type Price {
    type: String
    price: Float
  }

  type Image {
    path: String
    extension: String
  }
`;
