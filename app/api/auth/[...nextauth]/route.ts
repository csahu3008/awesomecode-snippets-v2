import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
// These two values should be a bit less than actual token lifetimes
const BACKEND_ACCESS_TOKEN_LIFETIME = 45 * 60; // 45 minutes
const BACKEND_REFRESH_TOKEN_LIFETIME = 6 * 24 * 60 * 60; // 6 days

class CustomAuthError extends Error {
  constructor(message = "") {
    super(message);
    this.message = message ;
  }
}

const getCurrentEpochTime = () => {
  return Math.floor(new Date().getTime() / 1000);
};
// const SIGN_IN_HANDLERS = {
//   "credentials": async (user, account, profile, email, credentials) => {
//     return true;
//   },
// };
// const SIGN_IN_PROVIDERS = Object.keys(SIGN_IN_HANDLERS);

export const authOptions = {
  pages: { signIn: "/sign-in" },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: BACKEND_REFRESH_TOKEN_LIFETIME,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "login",
      credentials: {
        username: {},
        password: {},
      },
      // The data returned from this function is passed forward as the
      // `user` variable to the signIn() and jwt() callback
      async authorize(credentials, req) {
        try {
          const response = await axios({
            url: process.env.NEXTAUTH_BACKEND_URL + "auth/token/",
            method: "post",
            data: credentials,
          });
          const data = response.data;
          if (data) return data;
        } catch (error) {
          if(error?.response?.data){
            throw new CustomAuthError(JSON.stringify(error.response.data))
          }else{
            throw new CustomAuthError('We couldn’t complete your login request. Please try again later.')
          }
        }
        return null;
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      id: "signup",
      credentials: {
        username: {},
        password: {},
        password2: {},
        email: {},
      },
      // The data returned from this function is passed forward as the
      // `user` variable to the signIn() and jwt() callback
      async authorize(credentials, req) {
        try {
          const response = await axios({
            url: process.env.NEXTAUTH_BACKEND_URL + "auth/register/",
            method: "post",
            data: credentials,
          });
          const data = response.data;
          if (data) return data;
        } catch (error) {
          if(error?.response?.data){
            throw new CustomAuthError(JSON.stringify(error.response.data))
          }else{
            throw new CustomAuthError('We couldn’t complete your login request. Please try again later.')
          }
          
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // allow every provider
      // if (!SIGN_IN_PROVIDERS.includes(account.provider)) return false;
      // return SIGN_IN_HANDLERS[account.provider](
      //   user, account, profile, email, credentials
      // );
      return true;
    },
    async jwt({ user, token, account }) {
      // If `user` and `account` are set that means it is a login event
      if (user && account) {
        // let backendResponse = account.provider === "credentials" ? user : account.meta;
        let backendResponse = user;
        token["user"] = backendResponse.user;
        token["access_token"] = backendResponse.access;
        token["refresh_token"] = backendResponse.refresh;
        token["ref"] = getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME;
        return token;
      }
      // Refresh the backend token if necessary
      if (getCurrentEpochTime() > token["ref"]) {
        const response = await axios({
          method: "post",
          url: process.env.NEXTAUTH_BACKEND_URL + "auth/token/refresh/",
          data: {
            refresh: token["refresh_token"],
          },
        });
        token["access_token"] = response.data.access;
        token["refresh_token"] = response.data.refresh;
        token["ref"] = getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME;
      }
      return token;
    },
    // Since we're using Django as the backend we have to pass the JWT
    // token to the client instead of the `session`.
    async session({ token }) {
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
