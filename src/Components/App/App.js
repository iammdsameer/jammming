import React from "react";
import "./App.css";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import Spotify from "../../util/Spotify";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: "Ola",
      playlistTracks: [],
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }
  addTrack(track) {
    if (!this.state.playlistTracks.find((any) => any.id === track.id)) {
      this.setState({
        playlistTracks: [...this.state.playlistTracks, track],
      });
    } else {
    }
  }
  removeTrack(track) {
    this.setState({
      playlistTracks: this.state.playlistTracks.filter(
        (all) => all.id !== track.id
      ),
    });
  }
  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }
  savePlaylist() {
    Spotify.savePlaylist(
      this.state.playlistName,
      this.state.playlistTracks.map((each) => each.uri)
    );
    this.setState({ playlistName: "New Playlist", playlistTracks: [] });
    // 63. uri of all songs from playlist shall return in array
  }
  search(q) {
    Spotify.search(q).then((tracks) => {
      this.setState({ searchResults: tracks });
    });
  }
  render() {
    return (
      <div>
        <h1>
          Ja<span className="highlight">mmm</span>ing
        </h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults
              onAdd={this.addTrack}
              searchResults={this.state.searchResults}
            />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
