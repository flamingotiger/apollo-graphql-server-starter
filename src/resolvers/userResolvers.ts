import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthenticationError } from "apollo-server";

export default {
  Query: {
    me: async (
      _: any,
      args: any,
      { models: { userModel }, me }: { models: any; me: any },
      info: any
    ) => {
      if (!me) {
        throw new AuthenticationError("You are not authenticated");
      }
      const user = await userModel.findById({ _id: me.id }).exec();
      return user;
    },
    user: async (
      _: any,
      { id }: { id: string },
      { models: { userModel }, me }: { models: any; me: any },
      info: any
    ) => {
      if (!me) {
        throw new AuthenticationError("You are not authenticated");
      }
      const user = await userModel.findById({ _id: id }).exec();
      return user;
    },
    login: async (
      _: any,
      { name, password }: { name: string; password: string },
      { models: { userModel } }: { models: any; me: any },
      info: any
    ) => {
      const user = await userModel.findOne({ name }).exec();

      if (!user) {
        throw new AuthenticationError("Invalid credentials");
      }

      const matchPasswords = bcrypt.compareSync(password, user.password);

      if (!matchPasswords) {
        throw new AuthenticationError("Invalid credentials");
      }

      const token = jwt.sign({ id: user.id }, "riddlemethis", {
        expiresIn: 24 * 10 * 50
      });

      return {
        token
      };
    }
  },
  Mutation: {
    createUser: async (
      _: any,
      { name, password }: { name: string; password: string },
      { models: { userModel } }: { models: any },
      info: any
    ) => {
      const user = await userModel.create({ name, password });
      return user;
    }
  },
  User: {
    posts: async (
      { id }: { id: string },
      args: any,
      { models: { postModel } }: { models: any },
      info: any
    ) => {
      const posts = await postModel.find({ author: id }).exec();
      return posts;
    }
  }
};
