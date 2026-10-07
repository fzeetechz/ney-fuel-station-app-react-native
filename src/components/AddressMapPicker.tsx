import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Keyboard,
  PermissionsAndroid,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import MapView, {Marker, PROVIDER_GOOGLE, Region} from 'react-native-maps';
import Toast from 'react-native-toast-message';
import {colors} from '../constants/colors';
import {DEFAULT_MAP_REGION, GOOGLE_MAPS_API_KEY} from '../constants/maps';
import {fontFamilies} from '../styles/typography';

export type SelectedMapAddress = {
  latitude: number;
  longitude: number;
  line1?: string;
  city?: string;
  postalCode?: string;
  country?: string;
};

type Props = {
  latitude?: number;
  longitude?: number;
  onAddressChange: (address: SelectedMapAddress) => void;
};

type GoogleAddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

type PlaceSuggestion = {
  description: string;
  place_id: string;
  structured_formatting?: {
    main_text?: string;
    secondary_text?: string;
  };
};

const componentValue = (
  components: GoogleAddressComponent[],
  types: string[],
  short = false,
) => {
  const component = components.find(item =>
    types.some(type => item.types.includes(type)),
  );
  return component ? (short ? component.short_name : component.long_name) : '';
};

export default function AddressMapPicker({
  latitude,
  longitude,
  onAddressChange,
}: Props) {
  const mapRef = useRef<MapView>(null);
  const [search, setSearch] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const skipNextSuggestionRequest = useRef(false);
  const [coordinate, setCoordinate] = useState({
    latitude: latitude ?? DEFAULT_MAP_REGION.latitude,
    longitude: longitude ?? DEFAULT_MAP_REGION.longitude,
  });

  useEffect(() => {
    if (latitude == null || longitude == null) {
      return;
    }
    const next = {latitude, longitude};
    setCoordinate(next);
    mapRef.current?.animateToRegion({...next, latitudeDelta: 0.012, longitudeDelta: 0.012});
  }, [latitude, longitude]);

  useEffect(() => {
    const query = search.trim();
    if (skipNextSuggestionRequest.current) {
      skipNextSuggestionRequest.current = false;
      return;
    }
    if (!isSearchFocused || query.length < 3) {
      setSuggestions([]);
      setIsLoadingSuggestions(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setIsLoadingSuggestions(true);
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}`,
          {signal: controller.signal},
        );
        const json = await response.json();
        let matches: PlaceSuggestion[] = json.predictions ?? [];

        // Geocoding is already required by the pin picker, so keep suggestions
        // useful even when the legacy Places endpoint is not enabled for a key.
        if (matches.length === 0) {
          const geocodeResponse = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}`,
            {signal: controller.signal},
          );
          const geocodeJson = await geocodeResponse.json();
          matches = (geocodeJson.results ?? []).map(
            (result: {formatted_address: string; place_id: string}) => ({
              description: result.formatted_address,
              place_id: result.place_id,
              structured_formatting: {main_text: result.formatted_address},
            }),
          );
        }
        setSuggestions(matches.slice(0, 5));
      } catch (error) {
        if (!(error instanceof Error && error.name === 'AbortError')) {
          setSuggestions([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingSuggestions(false);
        }
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [isSearchFocused, search]);

  const resolveCoordinate = async (next: {latitude: number; longitude: number}) => {
    setCoordinate(next);
    mapRef.current?.animateToRegion({...next, latitudeDelta: 0.012, longitudeDelta: 0.012});

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${next.latitude},${next.longitude}&key=${GOOGLE_MAPS_API_KEY}`,
      );
      const json = await response.json();
      const result = json.results?.[0];
      const components: GoogleAddressComponent[] = result?.address_components ?? [];
      const streetNumber = componentValue(components, ['street_number']);
      const route = componentValue(components, ['route']);
      const premise = componentValue(components, ['premise', 'subpremise']);
      const line1 = [premise || streetNumber, route].filter(Boolean).join(' ') || result?.formatted_address;
      const city = componentValue(components, [
        'locality',
        'postal_town',
        'administrative_area_level_2',
        'administrative_area_level_1',
      ]);
      const postalCode = componentValue(components, ['postal_code']);
      const country = componentValue(components, ['country'], true);
      setSearch(result?.formatted_address ?? '');
      onAddressChange({...next, line1, city, postalCode, country});
    } catch {
      onAddressChange(next);
      Toast.show({type: 'info', text1: 'Pin selected', text2: 'Enter the address details manually.'});
    }
  };

  const selectSuggestion = async (suggestion: PlaceSuggestion) => {
    try {
      setIsSearching(true);
      setSuggestions([]);
      setIsSearchFocused(false);
      skipNextSuggestionRequest.current = true;
      setSearch(suggestion.description);
      Keyboard.dismiss();
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?place_id=${encodeURIComponent(suggestion.place_id)}&key=${GOOGLE_MAPS_API_KEY}`,
      );
      const json = await response.json();
      const location = json.results?.[0]?.geometry?.location;
      if (!location) {
        throw new Error(json.error_message || 'Location details are unavailable.');
      }
      await resolveCoordinate({latitude: location.lat, longitude: location.lng});
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Could not select this address',
        text2: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const searchAddress = async () => {
    if (search.trim().length < 3) {
      Toast.show({type: 'error', text1: 'Enter at least 3 characters to search.'});
      return;
    }
    try {
      setIsSearching(true);
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(search.trim())}&key=${GOOGLE_MAPS_API_KEY}`,
      );
      const json = await response.json();
      const location = json.results?.[0]?.geometry?.location;
      if (!location) {
        throw new Error(json.error_message || 'No matching address found.');
      }
      await resolveCoordinate({latitude: location.lat, longitude: location.lng});
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Address not found',
        text2: error instanceof Error ? error.message : 'Try a more specific search.',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const useCurrentLocation = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Use your location',
            message: 'NeyFuel uses your location to place the delivery pin.',
            buttonPositive: 'Allow',
            buttonNegative: 'Not now',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Toast.show({type: 'error', text1: 'Location permission was not granted.'});
          return;
        }
      }
      setIsLocating(true);
      Geolocation.getCurrentPosition(
        position => {
          setIsLocating(false);
          resolveCoordinate({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        error => {
          setIsLocating(false);
          Toast.show({type: 'error', text1: 'Could not get your location', text2: error.message});
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } catch {
      setIsLocating(false);
      Toast.show({type: 'error', text1: 'Could not request location permission.'});
    }
  };

  const initialRegion: Region = {
    ...coordinate,
    latitudeDelta: 0.025,
    longitudeDelta: 0.025,
  };

  return (
    <View>
      <View style={styles.searchRow}>
        <TextInput
          accessibilityLabel="Search address on map"
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 150)}
          onChangeText={setSearch}
          onFocus={() => setIsSearchFocused(true)}
          onSubmitEditing={() => {
            setSuggestions([]);
            searchAddress();
          }}
          placeholder="Search an address"
          placeholderTextColor={colors.muted}
          returnKeyType="search"
          style={styles.searchInput}
          value={search}
        />
        <Pressable onPress={searchAddress} style={styles.searchButton}>
          {isSearching ? <ActivityIndicator color={colors.white} size="small" /> : <Text style={styles.searchLabel}>Search</Text>}
        </Pressable>
      </View>

      {isSearchFocused && (isLoadingSuggestions || suggestions.length > 0) ? (
        <View style={styles.suggestionsCard}>
          {isLoadingSuggestions && suggestions.length === 0 ? (
            <View style={styles.suggestionLoading}>
              <ActivityIndicator color={colors.primary} size="small" />
              <Text style={styles.suggestionLoadingText}>Finding locations…</Text>
            </View>
          ) : (
            suggestions.map((suggestion, index) => (
              <Pressable
                key={suggestion.place_id}
                onPress={() => selectSuggestion(suggestion)}
                style={({pressed}) => [
                  styles.suggestionRow,
                  index < suggestions.length - 1 && styles.suggestionDivider,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.suggestionPin}>
                  <Text style={styles.suggestionPinText}>●</Text>
                </View>
                <View style={styles.suggestionCopy}>
                  <Text numberOfLines={1} style={styles.suggestionTitle}>
                    {suggestion.structured_formatting?.main_text || suggestion.description}
                  </Text>
                  {suggestion.structured_formatting?.secondary_text ? (
                    <Text numberOfLines={1} style={styles.suggestionSubtitle}>
                      {suggestion.structured_formatting.secondary_text}
                    </Text>
                  ) : null}
                </View>
              </Pressable>
            ))
          )}
        </View>
      ) : null}

      <View style={styles.mapFrame}>
        <MapView
          initialRegion={initialRegion}
          onPress={event => resolveCoordinate(event.nativeEvent.coordinate)}
          provider={PROVIDER_GOOGLE}
          ref={mapRef}
          showsCompass
          style={StyleSheet.absoluteFill}
        >
          <Marker
            coordinate={coordinate}
            draggable
            onDragEnd={event => resolveCoordinate(event.nativeEvent.coordinate)}
            pinColor={colors.primary}
          />
        </MapView>
        <Text style={styles.mapHint}>Tap or drag the pin to fine-tune</Text>
      </View>

      <Pressable
        disabled={isLocating}
        onPress={useCurrentLocation}
        style={({pressed}) => [styles.locationButton, pressed && styles.pressed]}
      >
        {isLocating ? <ActivityIndicator color={colors.primary} size="small" /> : <Text style={styles.target}>◎</Text>}
        <Text style={styles.locationLabel}>Use Current Location</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  searchRow: {flexDirection: 'row', gap: 8, marginBottom: 10},
  searchInput: {backgroundColor: colors.white, borderColor: colors.border, borderRadius: 8, borderWidth: 1, color: colors.text, flex: 1, fontFamily: fontFamilies.body, fontSize: 13, height: 46, paddingHorizontal: 13},
  searchButton: {alignItems: 'center', backgroundColor: colors.navy, borderRadius: 8, justifyContent: 'center', width: 75},
  searchLabel: {color: colors.white, fontFamily: fontFamilies.bodyBold, fontSize: 12},
  suggestionsCard: {backgroundColor: colors.white, borderColor: colors.border, borderRadius: 10, borderWidth: 1, elevation: 5, marginBottom: 10, marginTop: -2, overflow: 'hidden', shadowColor: '#0C1B3A', shadowOffset: {height: 3, width: 0}, shadowOpacity: 0.14, shadowRadius: 7},
  suggestionRow: {alignItems: 'center', flexDirection: 'row', minHeight: 54, paddingHorizontal: 12, paddingVertical: 8},
  suggestionDivider: {borderBottomColor: '#ECEEF2', borderBottomWidth: 1},
  suggestionPin: {alignItems: 'center', backgroundColor: '#FCE9DF', borderRadius: 15, height: 30, justifyContent: 'center', marginRight: 10, width: 30},
  suggestionPinText: {color: colors.primary, fontSize: 10},
  suggestionCopy: {flex: 1},
  suggestionTitle: {color: colors.text, fontFamily: fontFamilies.bodyBold, fontSize: 12},
  suggestionSubtitle: {color: colors.muted, fontFamily: fontFamilies.body, fontSize: 10, marginTop: 3},
  suggestionLoading: {alignItems: 'center', flexDirection: 'row', height: 52, justifyContent: 'center'},
  suggestionLoadingText: {color: colors.muted, fontFamily: fontFamilies.body, fontSize: 11, marginLeft: 8},
  mapFrame: {borderRadius: 12, height: 210, overflow: 'hidden'},
  mapHint: {alignSelf: 'center', backgroundColor: 'rgba(16,42,94,0.88)', borderRadius: 14, bottom: 10, color: colors.white, fontFamily: fontFamilies.body, fontSize: 10, overflow: 'hidden', paddingHorizontal: 12, paddingVertical: 6, position: 'absolute'},
  locationButton: {alignItems: 'center', backgroundColor: colors.white, borderColor: colors.border, borderRadius: 8, borderWidth: 1, flexDirection: 'row', height: 45, justifyContent: 'center', marginTop: 10},
  locationLabel: {color: colors.primary, fontFamily: fontFamilies.bodyBold, fontSize: 12, marginLeft: 8},
  target: {color: colors.primary, fontSize: 19},
  pressed: {opacity: 0.75},
});
