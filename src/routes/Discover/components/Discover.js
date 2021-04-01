import React, { Component } from 'react';
import DiscoverBlock from './DiscoverBlock/components/DiscoverBlock';
import '../styles/_discover.scss';
import axios from 'axios';
import api from '../../../config';
import qs from 'querystring';

export default class Discover extends Component {
  constructor() {
    super();

    this.state = {
      newReleases: [],
      playlists: [],
      categories: [],
      authToken:""
    };
  }

  componentDidMount() {
      let config_str = qs.stringify({
         'grant_type':'client_credentials'
      })

    const list_new_releases = "	https://api.spotify.com/v1/browse/new-releases"
    const list_featured_playlists = "https://api.spotify.com/v1/browse/featured-playlists"
    const list_categories = "https://api.spotify.com/v1/browse/categories"

    let headers = {
      headers: {
          'Content-Type':'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(`${api.api.clientId}:${api.api.clientSecret}`)}`
        }
    }
    axios.post(api.api.authUrl, config_str, headers).then((resp) => {
        this.setState({ authToken: resp.data.access_token })
        console.log(this.state)
        let headers2={
      headers: {
          'Content-Type': 'application/json',
          'Accept':'application/json',
          Authorization: `Bearer ${this.state.authToken}`
        }
    }
        axios.get(list_new_releases, headers2).then((resp2) => {
          console.log(resp2)
          this.setState({newReleases: resp2.data.albums.items})
        })

        axios.get(list_featured_playlists , headers2).then((resp3) => {
          console.log(resp3)
          this.setState({playlists: resp3.data.playlists.items})
        })
      
      axios.get(list_categories  , headers2).then((resp4) => {
          console.log(resp4)
          this.setState({categories: resp4.data.categories.items})
        })
    })
  }

  render() {
    const { newReleases, playlists, categories } = this.state;

    return (
      <div className="discover">
        <DiscoverBlock text="RELEASED THIS WEEK" id="released" data={newReleases} />
        <DiscoverBlock text="FEATURED PLAYLISTS" id="featured" data={playlists} />
        <DiscoverBlock text="BROWSE" id="browse" data={categories} imagesKey="icons" />
      </div>
    );
  }
}
