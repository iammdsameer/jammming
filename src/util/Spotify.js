const clientID = "d9cb14f4ee30456281808c20c1281b9c"; // Your Client ID from Spotify
const redirectTo = "http:%2F%2Fjammming-with-spotify.surge.sh%2F"; // Change to your website to be redirected to.

let accessToken;
let expiresIn;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    } else {
      const url = window.location.href;
      accessToken = url.match(/access_token=([^&]*)/);
      expiresIn = url.match(/expires_in=([^&]*)/);
      if (accessToken && expiresIn) {
        accessToken = accessToken[1];
        expiresIn = expiresIn[1];
        window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
        window.history.pushState("Access Token", null, "/");
        return accessToken;
      } else {
        window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectTo}`;
      }
    }
  },
  search(q) {
    let accessToken = this.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${q}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((jsonResponse) => {
        // console.log(jsonResponse.tracks.items);
        if (jsonResponse.tracks.items) {
          return jsonResponse.tracks.items.map((each) => {
            return {
              id: each.id,
              name: each.name,
              artist: each.artists[0].name,
              album: each.album.name,
              uri: each.uri,
            };
          });
        }
      });
  },
  savePlaylist(playlistName, trackURIs) {
    if (playlistName && trackURIs) {
      const token = accessToken;
      const headers = { Authorization: `Bearer ${token}` };
      let userId;
      let playlistId;
      fetch(`https://api.spotify.com/v1/me`, { headers })
        .then((response) => response.json())
        .then((jsonResponse) => {
          userId = jsonResponse.id;
        })
        .then(() => {
          fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            method: "POST",
            headers,
            body: JSON.stringify({ name: playlistName }),
          })
            .then((response) => response.json())
            .then((jsonResponse) => (playlistId = jsonResponse.id))
            .then(() => {
              fetch(
                `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                  body: JSON.stringify({ uris: trackURIs }),
                }
              );
            });
        });
    }
  },
};

export default Spotify;

// /access_token=([^&]*)/
// /expires_in=([^&]*)/
