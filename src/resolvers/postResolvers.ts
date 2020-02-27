import { AuthenticationError } from "apollo-server";

export default {
  Query: {
    post: async (
      _: any,
      { id }: { id: string },
      { models: { postModel }, me }: { models: any; me: any },
      info: any
    ) => {
      if (!me) {
        throw new AuthenticationError("You are not authenticated");
      }
      const post = await postModel.findById({ _id: id }).exec();
      return post;
    },
    posts: async (
      _: any,
      args: any,
      { models: { postModel }, me }: { models: any; me: any },
      info: any
    ) => {
      if (!me) {
        throw new AuthenticationError("You are not authenticated");
      }
      const posts = await postModel.find({ author: me.id }).exec();
      return posts;
    }
  },
  Mutation: {
    createPost: async (
      _: any,
      { title, content }: { title: string; content: string },
      { models: { postModel }, me }: { models: any; me: any },
      info: any
    ) => {
      if (!me) {
        throw new AuthenticationError("You are not authenticated");
      }
      const post = await postModel.create({ title, content, author: me.id });
      return post;
    }
  },
  Post: {
    author: async (
      { author }: { author: string },
      args: any,
      { models: { userModel } }: { models: any },
      info: any
    ) => {
      const user = await userModel.findById({ _id: author }).exec();
      return user;
    }
  }
};
