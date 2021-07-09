import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

// const scopes = [
//   "ugc-image-upload",
//   "user-read-playback-state",
//   "user-modify-playback-state",
//   "user-read-currently-playing",
//   "streaming",
//   "app-remote-control",
//   "user-read-email",
//   "user-read-private",
//   "playlist-read-collaborative",
//   "playlist-modify-public",
//   "playlist-read-private",
//   "playlist-modify-private",
//   "user-library-modify",
//   "user-library-read",
//   "user-top-read",
//   "user-read-playback-position",
//   "user-read-recently-played",
//   "user-follow-read",
//   "user-follow-modify",
// ];

export default NextAuth({
  providers: [
    Providers.Spotify({
      clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET,
      scope:
        'user-read-private user-read-email user-top-read playlist-modify-public playlist-modify-private',
    }),
  ],
  secret: process.env.NEXT_PUBLIC_SECRET,
  callbacks: {
    async jwt(token, user, account, profile, isNewUser) {
      // console.log(`Access Token: ${token.accessToken}`)
      // console.log(account)
      // console.log(token)
      console.log(profile)
      console.log(isNewUser)

      if (account?.accessToken) {
        token.accessToken = account.accessToken
      }

      if (account?.refreshToken) {
        token.refreshToken = account.refreshToken
      }

      return token
    },
    async session(session, token) {
      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken
      return session
    },
  },
})
