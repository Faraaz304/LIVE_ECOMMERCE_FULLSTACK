// import GoogleProvider from "next-auth/providers/google";

// export const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       authorization: {
//         params: {
//           scope: "openid email profile https://www.googleapis.com/auth/youtube",
//           access_type: "offline", // IMPORTANT: Asks for a refresh token
//           prompt: "consent",
//         },
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, account }) {
//       // 1. Initial Sign In: Save the token and the time it expires
//       if (account) {
//         return {
//           accessToken: account.access_token,
//           refreshToken: account.refresh_token,
//           expiresAt: Date.now() + account.expires_in * 1000, // typically 1 hour
//         };
//       }

//       // 2. Return previous token if it has not expired yet
//       if (Date.now() < token.expiresAt) {
//         return token;
//       }

//       // 3. Access Token has expired, try to update it using Refresh Token
//       try {
//         const response = await fetch("https://oauth2.googleapis.com/token", {
//           headers: { "Content-Type": "application/x-www-form-urlencoded" },
//           body: new URLSearchParams({
//             client_id: process.env.GOOGLE_CLIENT_ID,
//             client_secret: process.env.GOOGLE_CLIENT_SECRET,
//             grant_type: "refresh_token",
//             refresh_token: token.refreshToken,
//           }),
//           method: "POST",
//         });

//         const tokens = await response.json();

//         if (!response.ok) throw tokens;

//         return {
//           ...token, // Keep existing refresh token
//           accessToken: tokens.access_token,
//           expiresAt: Date.now() + tokens.expires_in * 1000,
//         };
//       } catch (error) {
//         console.error("Error refreshing access token", error);
//         return { ...token, error: "RefreshAccessTokenError" };
//       }
//     },
//     async session({ session, token }) {
//       session.accessToken = token.accessToken;
      
//       session.refreshToken = token.refreshToken; 
//       session.expiresAt = token.expiresAt;
//       session.error = token.error;
      
//       return session;
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };



import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/youtube",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, account }) {
      // On initial sign-in
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token || token.refreshToken;
        token.expiresAt = Date.now() + account.expires_in * 1000; // 1 hour

        return token;
      }

      // We do NOT auto-refresh Google tokens to avoid breaking your app
      // Instead, we return the existing token unchanged.
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.expiresAt = token.expiresAt;
      return session;
    },
  },

  // Disable automatic NextAuth refresh, revalidate, and unstable rerenders
  events: {},
  secret: process.env.NEXTAUTH_SECRET,
};
