<div id="top"></div>

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
![github-repo-size-shield]
![last-commit-badge]

<!-- PROJECT LOGO -->
<br />
<div align="center">

  <h1 align="center">Spotifaves</h1>

  <p align="center">
 A website where users can view their top artists, top tracks, top genres, and recently played tracks on Spotify. They can also generate playlists based on their personalized data to share with friends.
 <br />
  <br />
     <a href="spotifaves.vercel.app/">View Demo</a>
    ·
    <a href="https://github.com/felipeantoniob/spotifaves/issues">Report Bug</a>
    ·
    <a href="https://github.com/felipeantoniob/spotifaves/issues">Request Feature</a>
  </p>
</div>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Tutorial][tutorial-gif]](spotifaves.vercel.app/)

I created this website to allow users to more easily visualize their favourites on Spotify in a simple and convenient interface.

Users can view their favourite songs, artist, genres, and what they've been listening to recently.

They can then generate unique playlists based on their data, for example:

- a playlist of their top tracks from the last month
- a playlist of their most recently played tracks
- a playlist of their all time top artists' top tracks

Users can select the time frame from which the data is computed, long term (calculated from several years of data and including all new data as it becomes available), medium term (approximately last 6 months), or short term (approximately last 4 weeks).

Being able to see this personalized data is a feature that I've found extremely useful for sharing and discussing music with friends.

<p align="right">(<a href="#top">back to top</a>)</p>

### Built With

- [Next.js](https://nextjs.org/)
- [React.js](https://reactjs.org/)
- [spotify-web-api-node](https://github.com/thelinmichael/spotify-web-api-node)
- [NextAuth.js](https://next-auth.js.org/)
- [Bootstrap](https://getbootstrap.com/)
- [React Bootstrap](https://react-bootstrap.github.io/)
- [Sass](https://sass-lang.com/)
- [Framer Motion](https://www.framer.com/motion/)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- EXAMPLES -->

## Examples

![Profile Page Screenshot][profile-page-screenshot]
![Top Artists Screenshot][top-artists-screenshot]
![Top Tracks Screenshot][top-tracks-screenshot]
![Top Genres Screenshot][top-genres-screenshot]
![Recent Tracks Screenshot][recent-tracks-screenshot]
![Playlist Creation Screenshot][playlist-creation-screenshot]

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

- npm

  ```sh
  npm install npm@latest -g
  ```

### Installation

1. [Register a Spotify App](https://developer.spotify.com/dashboard/applications) and add `http://localhost:3000/callback` as a Redirect URI in the app settings

1. Create an `.env` file in the root of the project based on `.env.example`

1. Clone the repo
   ```sh
   git clone https://github.com/felipeantoniob/spotifaves.git
   ```
1. Install packages

   ```sh
   npm install
   ```

### Usage

1. Run the development server

   ```sh
   npm run dev
   ```

2. Open http://localhost:3000 with your browser to see the result.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- DEPLOYMENT -->

## Deployment

1. Install Vercel CLI

   ```sh
   npm i -g vercel
   ```

1. Deploy project to Vercel

   ```sh
   vercel
   ```

1. Set Vercel environment variables

   ```sh
   vercel env add NEXTAUTH_SECRET="YOUR SECRET HERE"
   vercel env add NEXTAUTH_URL="YOUR SITE'S DOMAIN HERE"
   vercel env add NEXT_PUBLIC_SPOTIFY_CLIENT_ID="YOUR SPOTIFY CLIENT ID HERE"
   vercel env add NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET="YOUR SPOTIFY CLIENT SECRET HERE"
   ```

1. Add `https://app-name.vercel.app/api/auth/callback/spotify` as a Redirect URI in the Spotify application settings

1. Once the app is live on Vercel, hitting http://app-name.vercel.app/login should be the same as hitting http://localhost:3000/login

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Felipe Antonio Buencamino - felipebuencamino@gmail.com.com

Project Link: [https://github.com/felipeantoniob/spotifaves](https://github.com/felipeantoniob/spotifaves)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

- [React Icons](https://react-icons.github.io/react-icons/search)
- [Day.js](https://day.js.org/)
- [Chart.js](https://www.chartjs.org/)
- [react-chartjs-2](https://react-chartjs-2.js.org/)
- [Img Shields](https://shields.io)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[stars-shield]: https://img.shields.io/github/stars/felipeantoniob/spotifaves.svg?style=for-the-badge
[stars-url]: https://github.com/felipeantoniob/spotifaves/stargazers
[issues-shield]: https://img.shields.io/github/issues/felipeantoniob/spotifaves.svg?style=for-the-badge
[issues-url]: https://github.com/felipeantoniob/spotifaves/issues
[license-shield]: https://img.shields.io/github/license/felipeantoniob/spotifaves.svg?style=for-the-badge
[license-url]: https://github.com/felipeantoniob/spotifaves/blob/master/LICENSE.txt
[github-repo-size-shield]: https://img.shields.io/github/repo-size/felipeantoniob/spotifaves?style=for-the-badge
[last-commit-badge]: https://img.shields.io/github/last-commit/felipeantoniob/spotifaves?style=for-the-badge
[top-tracks-screenshot]: /public/images/top_tracks_screenshot.png
[top-genres-screenshot]: /public/images/top_genres_screenshot.png
[top-artists-screenshot]: /public/images/top_artists_screenshot.png
[recent-tracks-screenshot]: /public/images/recent_tracks_screenshot.png
[profile-page-screenshot]: /public/images/profile_page_screenshot.png
[playlist-creation-screenshot]: /public/images/playlist_creation_screenshot.png
[tutorial-gif]: /public/images/tutorial.webp
