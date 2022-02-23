import NextAuth, { Account, Profile, Session, User } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import { getToken } from 'next-auth/jwt'
import SpotifyProvider from 'next-auth/providers/spotify'

const scopes = [
  // "ugc-image-upload",
  // "user-read-playback-state",
  // "user-modify-playback-state",
  // "user-read-currently-playing",
  // "streaming",
  // "app-remote-control",
  'user-read-email',
  'user-read-private',
  // "playlist-read-collaborative",
  'playlist-modify-public',
  'playlist-read-private',
  'playlist-modify-private',
  // "user-library-modify",
  // "user-library-read",
  'user-top-read',
  // "user-read-playback-position",
  'user-read-recently-played',
  'user-follow-read',
  // "user-follow-modify",
]

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: String(process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID),
      clientSecret: String(process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET),
      authorization: `https://accounts.spotify.com/authorize?scope=${scopes.join('%20')}`,
    }),
  ],
  // The secret should be set to a reasonably long random string.
  // It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
  // a separate secret is defined explicitly for encrypting the JWT.
  secret: process.env.NEXTAUTH_SECRET,
  // secret: process.env.NEXT_PUBLIC_SECRET,
  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `strategy` should be set to 'jwt' if no database is used.
    strategy: 'jwt',
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    // A secret to use for key generation (you should set this explicitly)
    secret: process.env.NEXTAUTH_SECRET,
    // The maximum age of the NextAuth.js issued JWT in seconds.
    // Defaults to `session.maxAge`.
    maxAge: 60 * 60 * 24 * 30,
  },
  callbacks: {
    async jwt(params: {
      token: JWT
      user?: User
      account?: Account
      profile?: Profile
      isNewUser?: boolean
    }) {
      // Persist the OAuth access_token to the token right after signin
      if (params.account) {
        params.token.accessToken = params.account?.access_token
      }

      if (params.account) {
        params.token.refreshToken = params.account?.refresh_token
      }

      return params.token
    },
    async session(params: { session: Session; token: JWT }) {
      params.session.accessToken = params.token.accessToken
      params.session.refreshToken = params.token.refreshToken

      return params.session
    },
  },
})
