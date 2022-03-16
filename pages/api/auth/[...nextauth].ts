import NextAuth, { Account, Profile, Session, User } from 'next-auth'
import { JWT } from 'next-auth/jwt'
// import { getToken } from 'next-auth/jwt'
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

const SPOTIFY_AUTHORIZATION_URL = `https://accounts.spotify.com/authorize?scope=${scopes.join(
  '%20'
)}`

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token: JWT) {
  try {
    const url =
      'https://accounts.spotify.com/api/token?' +
      new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
        client_secret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken as string,
      })

    console.log(url)

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    }
  } catch (error) {
    console.log(error)

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: String(process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID),
      clientSecret: String(process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET),
      authorization: SPOTIFY_AUTHORIZATION_URL,
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
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  jwt: {
    // A secret to use for key generation (you should set this explicitly)
    secret: process.env.NEXTAUTH_SECRET,
    // The maximum age of the NextAuth.js issued JWT in seconds.
    // Defaults to `session.maxAge`.
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  callbacks: {
    async jwt(params: {
      token: JWT
      user?: User
      account?: Account
      profile?: Profile
      isNewUser?: boolean
    }) {
      // Initial sign in
      if (params.account && params.user) {
        // console.log('Initial sign in')
        // console.log(params.token)
        return {
          accessToken: params.account.access_token,
          accessTokenExpires: Date.now() + params.account.expires_at! * 1000,
          refreshToken: params.account.refresh_token,
          user: params.user,
        }
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (params.token.accessTokenExpires as number)) {
        return params.token
      }

      // Access token has expired, try to update it
      return refreshAccessToken(params.token)

      // // Persist the OAuth access_token to the token right after signin
      // if (params.account) {
      //   params.token.accessToken = params.account?.access_token
      //   params.token.refreshToken = params.account?.refresh_token
      // }
      // return params.token
    },
    async session(params: { session: Session; token: JWT; user: User }) {
      params.session.user = params.token.user as User
      params.session.accessToken = params.token.accessToken
      params.session.error = params.token.error

      // params.session.refreshToken = params.token.refreshToken

      return params.session
    },
  },
})
