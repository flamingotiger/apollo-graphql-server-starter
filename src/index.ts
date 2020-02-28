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

// // prisma
// import { prisma } from "./generated/prisma-client";

// // A `main` function so that we can use async/await
// async function main() {
//   // Create a new user called `Alice`
//   const newUser = await prisma.createUser({ name: "hong" });
//   console.log(`Created new user: ${newUser.name} (ID: ${newUser.id})`);

//   // Read all users from the database and print them to the console
//   const allUsers = await prisma.users();
//   console.log(allUsers);
// }

// main().catch(e => console.error(e));

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
