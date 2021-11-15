import {
  InfoWindow,
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
import './App.css';
import React from 'react';
import Geocode from "react-geocode";
import { Descriptions, Badge } from 'antd';
import AutoComplete from 'react-google-autocomplete';

Geocode.setApiKey("AIzaSyB_FakQdb-NSYppHt0noXjP_XToZK1PdBA");
class App extends React.Component {
  state = {
    address: "",
    city: "",
    area: "",
    state: "",
    zoom: 15,
    height: 400,
    mapPositon: {
      lat: 21.013791,
      lng: 105.526066
    },
    markerPosition: {
      lat: 21.013791,
      lng: 105.526066
    }
  }
  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.setState({
          mapPosition: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          },
          markerPosition: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        }, () => {
          Geocode.fromLatLng(position.coords.latitude, position.coords.longitude)
            .then(response => {
              const address = response.results[0].formatted_address,
                addressArray = response.results[0].address_components,
                city = this.getCity(addressArray),
                area = this.getArea(addressArray),
                state = this.getState(addressArray)

              this.setState({
                address: address,
                area: area,
                city: city,
                state: state,
              })
              console.log(this.state.area + ' ' + this.state.state + ' ' + this.state.city);
              console.log(response);
            })
        })
      })
    }
  }

  getCity = (addressArray) => {
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[i].types[0] && 'administrative_area_level_2' === addressArray[i].types[0]) {
        return addressArray[i].long_name;
      }
    }
    return '';
  }

  getArea = (addressArray) => {
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[i].types[0]) {
        for (let j = 0; j < addressArray.length; j++) {
          if ('sublocality_level_1' === addressArray[i].types[j] || 'locality' === addressArray[i].types[j]) {
            return addressArray[i].long_name;
          }
        }
      }
    }
    return '';
  }

  getState = (addressArray) => {
    for (let i = 0; i < addressArray.length; i++) {
      for (let i = 0; i < addressArray.length; i++) {
        if (addressArray[i].types[0] && 'administrative_area_level_1' === addressArray[i].types[0]) {
          return addressArray[i].long_name;
        }
      }
    }
    return '';
  }

  onMarkerDragEnd = (event) => {
    let newLat = event.latLng.lat();
    let newLng = event.latLng.lng();

    Geocode.fromLatLng(newLat, newLng)
      .then(response => {
        const address = response.results[0].formatted_address,
          addressArray = response.results[0].address_components,
          city = this.getCity(addressArray),
          area = this.getArea(addressArray),
          state = this.getState(addressArray)

        this.setState({
          address: address,
          area: area,
          city: city,
          state: state,
          markerPosition: {
            lat: newLat,
            lng: newLng
          },
          mapPosition: {
            lat: newLat,
            lng: newLng
          }
        })
        console.log(this.state.area + ' ' + this.state.state + ' ' + this.state.city);
        console.log(response);
      })
  }

  onPlaceSelected = (place) => {
    const address = place.formatted_address,
      addressArray = place.address_components,
      city = this.getCity(addressArray),
      area = this.getArea(addressArray),
      state = this.getState(addressArray),
      newLat = place.geometry.location.lat(),
      newLng = place.geometry.location.lng();
    this.setState({
      address: address,
      area: area,
      city: city,
      state: state,
      markerPosition: {
        lat: newLat,
        lng: newLng
      },
      mapPosition: {
        lat: newLat,
        lng: newLng
      }
    })
  }

  render() {
    const MapWithAMarker = withScriptjs(withGoogleMap(props =>
      <GoogleMap
        defaultZoom={8}
        defaultCenter={{ lat: this.state.mapPositon.lat, lng: this.state.mapPositon.lng }}
      >
        <Marker
          draggable={true}
          onDragEnd={this.onMarkerDragEnd}
          position={{ lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng }}
        >
          <InfoWindow>
            <div>
              {this.state.address + ' ' + this.state.markerPosition.lat + ' ' + this.state.markerPosition.lng}
            </div>
          </InfoWindow>
        </Marker>
        <AutoComplete
          style={{ width: "100%", height: '40px', paddingLeft: 16, marginTop: 2, marginBottom: '2rem' }}
          types={['regions']}
          onPlaceSelected={this.onPlaceSelected}
        />

      </GoogleMap>
    ));

    return (
      <div style={{ padding: '1rem', margin: '0 auto', maxWidth: 1000 }}>
        <h1>Google Map Basic</h1>
        <Descriptions bordered>
          <Descriptions.Item label="City">{this.state.city}</Descriptions.Item>
          <Descriptions.Item label="Area">{this.state.area}</Descriptions.Item>
          <Descriptions.Item label="State">{this.state.state}</Descriptions.Item>
          <Descriptions.Item label="Address">{this.state.address}</Descriptions.Item>
        </Descriptions>
        <MapWithAMarker
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyB_FakQdb-NSYppHt0noXjP_XToZK1PdBA&v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `400px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
      </div>);
  }
}

export default App;
