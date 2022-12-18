import React from 'react'
import GeocodeInput, { nameConverter } from '../GeocodeInput/GeocodeInput'
import { GeocodingLocation } from '../../services/http/graphhopper/types'
import { useEffect, useRef, useState } from 'react'
import * as GraphHopper from '../../services/http/graphhopper/endpoints'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import useEvent from 'react-use-event-hook'

let routingLayer: any
const drawRoute = (path: any, mapRef: any) => {
  routingLayer?.addData({
    type: 'Feature',
    geometry: path.points,
  } as any)
  if (path.bbox) {
    let minLon = path.bbox[0]
    let minLat = path.bbox[1]
    let maxLon = path.bbox[2]
    let maxLat = path.bbox[3]
    let tmpB = new L.LatLngBounds(
      new L.LatLng(minLat, minLon),
      new L.LatLng(maxLat, maxLon)
    )
    mapRef.current?.fitBounds?.(tmpB)
  }
}
export interface Step1MarkersProps {
  onChangeTrip?: (trip: any) => void
  trip?: any
}
const Step1Markers: React.FC<Step1MarkersProps> = ({ onChangeTrip, trip }) => {
  const [startMarker, setStartMarker] = useState<GeocodingLocation | undefined>(
    trip?.startMarker
  )
  const [endMarker, setEndMarker] = useState<GeocodingLocation | undefined>(
    trip?.endMarker
  )
  const [mapReady, setMapReady] = useState<boolean>(false)

  const mapRef = useRef<any>(null)
  const putPointer = useEvent(
    (
      location: GeocodingLocation,
      stateSetter: React.Dispatch<
        React.SetStateAction<GeocodingLocation | undefined>
      >
    ) => {
      stateSetter(location)
      focusTrap.current?.focus?.()
      if (!startMarker || !endMarker)
        mapRef.current.flyTo([location.point.lat, location.point.lng], 14)
    }
  )
  useEffect(() => {
    if (startMarker && endMarker && mapReady) {
      const fn = async () => {
        routingLayer?.clearLayers?.()
        let data: any
        data = await GraphHopper.Route({
          point: [
            `${startMarker.point.lat},${startMarker.point.lng}`,
            `${endMarker.point.lat},${endMarker.point.lng}`,
          ],
        })

        let path = data.paths[0]
        const avrasyaGidis = path.points.coordinates.find((item: any) => {
          return (
            item[0] > 28.99857 &&
            item[0] < 28.99859 &&
            item[1] > 41.006 &&
            item[1] < 41.0060101
          )
        })

        const avrasyaDonus = path.points.coordinates.find((item: any) => {
          return (
            item[0] > 28.99853 &&
            item[0] < 28.99858 &&
            item[1] > 41.006049 &&
            item[1] < 41.006059
          )
        })

        const e5gidis = path.points.coordinates.find((item: any) => {
          return (
            item[0] > 29.026628 &&
            item[0] < 29.026632 &&
            item[1] > 41.052768 &&
            item[1] < 41.052772
          )
        })

        const e5donus = path.points.coordinates.find((item: any) => {
          return (
            item[0] > 29.041618 &&
            item[0] < 29.041622 &&
            item[1] > 41.038688 &&
            item[1] < 41.038692
          )
        })

        if (avrasyaGidis || e5gidis) {
          data = await GraphHopper.Route({
            point: [
              `${startMarker.point.lat},${startMarker.point.lng}`,
              `${41.09127008652312},${29.06244385249011}`,
              `${endMarker.point.lat},${endMarker.point.lng}`,
            ],
          })
          path = data.paths[0]
        }

        if (avrasyaDonus || e5donus) {
          data = await GraphHopper.Route({
            point: [
              `${startMarker.point.lat},${startMarker.point.lng}`,
              `${41.09139541852879},${29.061849474710474}`,
              `${endMarker.point.lat},${endMarker.point.lng}`,
            ],
          })
          path = data.paths[0]
        }
        onChangeTrip?.((prev: any) => ({
          ...prev,
          route: path,
          startMarker,
          endMarker,
        }))
        drawRoute(path, mapRef)
      }
      fn()
      routingLayer = L.geoJSON().addTo(mapRef.current)
      routingLayer.options = {
        style: { color: '#00cc33', weight: 8, opacity: 1 },
      }
    }
  }, [startMarker, endMarker, onChangeTrip, mapReady])

  const handleReady = () => {
    const attribution = document.getElementsByClassName(
      'leaflet-control-attribution'
    )

    if (attribution.length) {
      attribution[0].remove()
    }
    setMapReady(true)
  }
  const focusTrap = useRef<HTMLDivElement>(null)
  return (
    <div className="w-full h-100">
      <div className="z-[9999] mb-2 xl:px-0 text-left flex flex-col xl:flex-row items-center w-full justify-center">
        <GeocodeInput
          defaultValue={trip?.startMarker}
          label="Yükleme konumu"
          className="my-2 mx-auto md:mx-2 w-full xl:w-[38rem] inline-block"
          onSelectLocation={(location) => putPointer(location, setStartMarker)}
          placeholder="nereden?"
        />
        <div ref={focusTrap}></div>
        <GeocodeInput
          defaultValue={trip?.endMarker}
          label="Boşaltma konumu"
          className="my-2 mx-auto md:mx-2 w-full xl:w-[38rem] inline-block"
          onSelectLocation={(location) => putPointer(location, setEndMarker)}
          placeholder="nereye?"
        />
      </div>

      <MapContainer
        ref={mapRef}
        whenReady={handleReady}
        className="w-full mx-auto my-4  h-[300px]  md:h-[340px]"
        center={[41.0766019, 29.052495]}
        zoom={13}
        zoomControl={false}
        dragging={false}
        doubleClickZoom={false}
        scrollWheelZoom={false}
        touchZoom={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {!!startMarker && (
          <Marker position={[startMarker.point.lat, startMarker.point.lng]} />
        )}
        {!!endMarker && (
          <Marker position={[endMarker.point.lat, endMarker.point.lng]} />
        )}
      </MapContainer>
    </div>
  )
}

export default React.memo(Step1Markers)
