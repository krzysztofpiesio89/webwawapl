import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Brand {
    id: Int!
    name: String!
    models: [Model!]!
  }

  type Model {
    id: Int!
    name: String!
    brand: Brand!
    series: [Series!]!
  }

  type Series {
    id: Int!
    name: String!
    years: String!
    model: Model!
  }

  type City {
    id: Int!
    name: String!
    slug: String!
  }

  type Query {
    brands: [Brand!]!
    brand(name: String!): Brand
    cities: [City!]!
    city(slug: String!): City
    models(brandId: Int!): [Model!]!
    series(modelId: Int!): [Series!]!
  }
`;
