import React, { Component } from "react";
import SpotifyWebApi from "spotify-web-api-js";

import Header from "./components/header";
import "./App.css";

const spotifyApi = new SpotifyWebApi();
const CLIENT_ID = "d20f8f653162476a898df0eba2178402";
const REDIRECT_URI = "https://spoflex.vercel.app/callback";

class SpotifyMusicApp extends Component {
  state = {
    loggedIn: false,
    topTracks: [],
    relatedTracks: [],
  };

  componentDidMount() {
    this.checkAccessToken();
  }

  checkAccessToken = () => {
    const params = this.getHashParams();
    const accessToken = params.access_token;

    if (accessToken) {
      spotifyApi.setAccessToken(accessToken);
      this.setState({ loggedIn: true });
      this.getTopTracks();
    }
  };

  getHashParams = () => {
    const hashParams = {};
    const hash = window.location.hash.substring(1);
    const params = hash.split("&");
    params.forEach((param) => {
      const [key, value] = param.split("=");
      hashParams[key] = decodeURIComponent(value);
    });
    return hashParams;
  };

  getTopTracks = () => {
    spotifyApi.getMyTopTracks({ limit: 20 }).then((response) => {
      this.setState({ topTracks: response.items });
      this.getRelatedTracks(response.items);
    });
  };

  getRelatedTracks = (topTracks) => {
    if (topTracks.length > 0) {
      const trackId = topTracks[0].id;
      spotifyApi.getRecommendations({ seed_tracks: [trackId], limit: 20 }).then((response) => {
        this.setState({ relatedTracks: response.tracks });
      });
    }
  };

  goToTrack = (trackUri) => {
    // Spotify web playerını kullanarak seçili şarkıya gitmek için trackUri'yi kullanabilirsiniz.
    window.open(trackUri, "_blank");
  };

  render() {
    return (
      <body>

        <Header/>
        

        {!this.state.loggedIn ? (
          
          <div className="aut__btn">

            <div className="welcome__write">Hoşgeldiniz</div>

            <div className="welcome__write__2">Favori parçalarınızı dinlemekten sıkıldınız mı? Onlara yenilerini ekleyin...</div>

            <a href={`https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=user-top-read`}>
              Hemen Deneyin <i class="bi bi-caret-right-fill"></i>
            </a>
          </div>
        ) : (
          <div className="section">
            <ul>
              {this.state.relatedTracks.map((track, index) => (
                <li key={index} onClick={() => this.goToTrack(track.external_urls.spotify)}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/232px-Spotify_icon.svg.png" alt="" />
                  {track.name}
                  <i class="bi bi-caret-right-fill"></i>
                </li>
              ))}
            </ul>
          </div>
        )}
      </body>
    );
  }
}

export default SpotifyMusicApp;
