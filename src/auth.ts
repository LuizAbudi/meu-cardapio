import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import mongoose from "mongoose";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "MongoDB Atlas",
      credentials: {
        username: { label: "Database Username", type: "text" },
        password: { label: "Database Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Credenciais obrigatórias.");
        }

        const mongoUri = `mongodb+srv://${credentials.username}:${credentials.password}@${process.env.MONGODB_CLUSTER_URI}`;
        
        try {
          const connection = await mongoose.connect(mongoUri);

          await connection.connection.close();

          return {
            id: credentials.username,
            username: credentials.username,
          } as {
            id: string;
            username: string;
          };
        } catch (error) {
          console.error("Erro ao autenticar no MongoDB Atlas:", error);
          throw new Error("Usuário ou senha inválidos.");
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {    
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {    
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
