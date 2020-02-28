import cors from "cors";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
mongoose.set("useFindAndModify", false);
import { ApolloServer, AuthenticationError } from "apollo-server-express";
import compression from "compression";

import schemas from "./schemas";
import resolvers from "./resolvers";

import userModel from "./models/userModel";
import postModel from "./models/postModel";

const app = express();
app.use("*", cors());
app.use(compression());

const getUser = async (req: any) => {
  const token = req.headers["token"];

  if (token) {
    try {
      return await jwt.verify(token, "riddlemethis");
    } catch (e) {
      throw new AuthenticationError("Your session expired. Sign in again.");
    }
  }
};

const server = new ApolloServer({
  typeDefs: schemas,
  resolvers,
  context: async ({ req }) => {
    if (req) {
      const me = await getUser(req);
      return {
        me,
        models: {
          userModel,
          postModel
        }
      };
    }
  }
});

server.applyMiddleware({ app, path: "/graphql" });

app.listen(5000, () => {
  mongoose.connect("mongodb://localhost:27017/graphql", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log(`🏄‍♀️ connected server`);
});
