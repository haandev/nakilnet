

export type Point = { lat: number; lng: number }
export type GeocodingLocation = Point & {
  country: string
  countrycode: string
  name: string
  osm_id: number
  osm_key: string
  osm_type: string
  osm_value: string
  point: Point
  postcode: string
  city: string
  state: string
  street: string
  housenumber: string
}
