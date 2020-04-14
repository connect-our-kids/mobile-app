import gql from 'graphql-tag';
import { AddressDetail } from '../../../generated/AddressDetail';

export const ADDRESS_DETAIL_FRAGMENT = gql`
    fragment AddressDetail on PersonAddress {
        id
        isVerified
        country
        countryCode
        latitude
        locality
        longitude
        postalCode
        raw
        route
        state
        stateCode
        streetNumber
    }
`;

export function emptyAddressDetail(): Partial<AddressDetail> {
    return {
        __typename: 'PersonAddress',
        isVerified: false,
        raw: null,
        locality: '',
        country: null,
        countryCode: null,
        postalCode: null,
        route: '',
        state: null,
        stateCode: null,
        streetNumber: '',
        latitude: null,
        longitude: null,
    };
}

export function translateAddress(
    place: google.maps.GeocoderResult | google.maps.places.PlaceResult
): Partial<AddressDetail> {
    let address: Partial<AddressDetail> = {
        ...emptyAddressDetail(),
        raw: place.formatted_address || null,
    };

    if (place.address_components) {
        const address_components = new Map<string, string>();
        for (const component of place.address_components) {
            for (const type of component.types) {
                address_components.set(type, component.long_name);
                address_components.set(type + '_short', component.short_name);
            }
        }

        address = {
            ...address,
            streetNumber: address_components.get('street_number') || '',
            route: address_components.get('route') || '',
            locality: address_components.get('locality') || '',
            postalCode: address_components.get('postal_code') || null,
            state:
                address_components.get('administrative_area_level_1') || null,
            stateCode:
                address_components.get('administrative_area_level_1_short') ||
                null,
            country: address_components.get('country') || null,
            countryCode: address_components.get('country_short') || null,
        };

        if (address.country && address.state && !address.locality) {
            address.locality =
                address_components.get('administrative_area_level_2') || '';
        }
    }

    if (place.geometry) {
        address = {
            ...address,
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
        };
    }

    return address;
}
