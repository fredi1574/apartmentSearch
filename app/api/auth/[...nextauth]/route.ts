import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
        name: { label: "Name", type: "text", placeholder: "John Smith" }
      },
      async authorize(credentials) {
        if (credentials?.email) {
          // In a real app, you'd check a database here.
          // For now, we allow anyone to "log in" to demonstrate data separation.
          return {
            id: credentials.email, // Use email as ID for simplicity
            name: credentials.name || credentials.email.split('@')[0],
            email: credentials.email,
          };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async session({ session, token }: any) {
      if (session.user) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
