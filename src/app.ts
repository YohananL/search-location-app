import axios from 'axios'
import { Loader } from "@googlemaps/js-api-loader"
import { API_KEY } from '../api';

const form = document.querySelector('form')!;
const locationInput = document.getElementById('location')! as HTMLInputElement;

const GOOGLE_MAPS_API_KEY = API_KEY;
const loader = new Loader({
    apiKey: GOOGLE_MAPS_API_KEY,
    version: "weekly",
  });

type GoogleGeocodingResponse =
    {
        results:
        {
            geometry:
            {
                location:
                {
                    lat: number;
                    lng: number
                }
            }
        }[];
        status: 'OK' | 'ZERO_RESULTS';
    }

function searchLocationHandler(event: Event) {
    event.preventDefault();
    const address = locationInput.value

    axios
    .get<GoogleGeocodingResponse>(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(address)}&key=${GOOGLE_MAPS_API_KEY}`)
    .then(response => {
        if (response.data.status !== 'OK') {
            throw new Error(`Request returned status ${response.data.status}`);
        }

        const coordinates = response.data.results[0].geometry.location;

        loader
        .importLibrary('maps')
        .then(({Map}) => {
            new google.maps.Marker({
                position: coordinates,
                map: new Map(document.getElementById("google-maps"),
                {
                    center: coordinates,
                    zoom: 12,
                })
              });
        })
        .catch((err) => {
            console.log(err);
        });
    })
    .catch(err => {
        alert(err.message);
    });
}

form.addEventListener('submit', searchLocationHandler);
