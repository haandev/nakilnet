import axios from 'axios'
import React, { useMemo, useRef, useState } from 'react'
import useEvent from 'react-use-event-hook'
import { GeocodingLocation } from '../../services/http/graphhopper/types'
import { nameConverter } from '../GeocodeInput/GeocodeInput'
import { Steps } from '../Steps'
import { StepDataType } from '../Steps/types'
import Step01Phone from './Step01Phone'
import Step0CarType from './Step0CarType'
import Step1Markers from './Step1Markers'
import Step2Calendar from './Step2Calendar'
import Step3Textarea from './Step3Textarea'
import Step4Contact from './Step4Contact'
import Step5Summary from './Step5Summary'

export type TripType = {
  startMarker?: GeocodingLocation
  endMarker?: GeocodingLocation
  route?: any
  carType?: CarType
  selectedDays?: Array<any>
  information?: string
  helper?: number
  contact?: {
    firstName: string
    email: string
    phone: string
    title: string
  }
}
export type CarType = /* "shared" |  */ 'small' | 'medium' | 'large'
export const calculatePrice = (trip: any) => {
  const personCount = 0
  const furnitureService: boolean = false
  const carType: CarType = (trip?.carType as CarType) || 'large'

  const startFees = { small: 150, medium: 200, large: 250 }

  const pricePerKmMatrix = {
    /*     shared: [
      { from: 0, fee: 25 },
      { from: 25, fee: 22.5 },
      { from: 50, fee: 20 },
      { from: 75, fee: 17.5 },
      { from: 100, fee: 15 },
    ], */
    small: [
      { from: 0, fee: 9 },
      { from: 25, fee: 8 },
      { from: 50, fee: 7 },
      { from: 75, fee: 5 },
      { from: 100, fee: 4 },
    ],
    medium: [
      { from: 0, fee: 15 },
      { from: 25, fee: 12 },
      { from: 50, fee: 11 },
      { from: 75, fee: 10 },
      { from: 100, fee: 9 },
    ],
    large: [
      { from: 0, fee: 20 },
      { from: 25, fee: 16 },
      { from: 50, fee: 14 },
      { from: 75, fee: 13 },
      { from: 100, fee: 12 },
    ],
  }
  const discountDayMatrix = [
    { from: 0, discount: 0 },
    { from: 2, discount: 2.5 },
    { from: 3, discount: 5 },
    { from: 4, discount: 7.5 },
    { from: 5, discount: 10 },
  ]
  const pricePerPerson = 0
  const priceFurnitureService = 0

  let nonCalculatedDistance = trip?.route?.distance / 1000
  const distancePrice = pricePerKmMatrix[carType].reduce(
    (acc, { from, fee }, idx) => {
      let calculationDistance = 0
      if (
        pricePerKmMatrix[carType][idx + 1]?.from &&
        nonCalculatedDistance > pricePerKmMatrix[carType][idx + 1].from - from
      ) {
        calculationDistance = pricePerKmMatrix[carType][idx + 1].from - from
        nonCalculatedDistance -= pricePerKmMatrix[carType][idx + 1].from
      } else {
        calculationDistance = nonCalculatedDistance
        nonCalculatedDistance = 0
      }
      if (calculationDistance < 0) calculationDistance = 0
      return acc + calculationDistance * fee
    },
    0
  )
  const foundDiscountNext = discountDayMatrix.findIndex(
    (discount) => discount.from > (trip?.selectedDays?.length || 0)
  )
  const foundDiscount =
    foundDiscountNext < 1 ? discountDayMatrix.length - 1 : foundDiscountNext - 1

  const calendarDiscount =
    (discountDayMatrix[foundDiscount].discount * distancePrice) / 100

  const totalPrice =
    startFees[carType] +
    distancePrice -
    calendarDiscount +
    Number(furnitureService) * priceFurnitureService +
    pricePerPerson * personCount

  const fixedPrice = Math.ceil(totalPrice / 10) * 10
  return fixedPrice
}
const Map: any = ({ onSuccess }) => {
  const [trip, setTrip] = useState<TripType>({ carType: 'large' })

  const handleChangeTrip = useEvent((trip: any) => {
    setTrip(trip)
  })

  const price = useMemo(() => calculatePrice(trip), [trip])
  const nonFinish = useRef<any>(null)
  const handleNonFinish = useEvent(() => {
    const email = `
    TAMAMLANMAMIŞ <br>
      İletişime geçen müşterimiz <b>${trip?.contact?.firstName}</b>
      <b>${nameConverter(
        trip?.startMarker as GeocodingLocation
      )}</b> konumundan alacağız ve
      <b>${nameConverter(
        trip?.endMarker as GeocodingLocation
      )}</b> konumuna teslim edeceğiz. <br />
      ${
        !Boolean(trip?.helper) &&
        '<span>Herhangi bir yardımcı personel hizmeti istemedi</span>'
      }
      <br />
      Taşıma için müsait olduğunuz günler
      <b>
        ${trip?.selectedDays
          ?.map((day: { date: Date }) => {
            return day.date.toLocaleDateString()
          })
          ?.join(', ')}
      </b>
      . Bu günlerden biri için planlama yapılacaktır.
      <br />
      Yolculuğumuz toplam <b>${Math.floor(trip.route.distance / 1000)}km</b>,
      Talep edeceğimiz ücret ise <b>${calculatePrice(trip)}₺</b>
      olmaktadır.
      <br />
      Yük hakkında verdiği bilgi ise şöyle: <br />
      <b>${trip.information}</b>
      <br />
      Onaylı telefon numarası
      <a href="tel:${trip?.contact?.phone}">${
      trip?.contact?.phone
    }</a> telefonundan ulaşarak rotanızı birlikte
      onaylayacağız.

      <br />
      Onaylı eposta numarası
      <a href="mailto:${trip?.contact?.email}">${trip?.contact?.email}</a> <br/>
      Detaylı Bilgi <br/>
<pre>
      ${JSON.stringify({ ...trip, route: undefined })}</pre>
      `

    nonFinish.current = setTimeout(
      () => axios.post('/api/mail', { email, name: trip.contact?.firstName }),
      3000
    )
  })
  const steps = useMemo<StepDataType>(
    () => [
      {
        name: 'İhtiyacınıza yönelik bir araç seçin',
        children: <Step0CarType trip={trip} onChangeTrip={handleChangeTrip} />,
        continueCondition: Boolean(trip?.carType),
        nextTitle: 'Konum seçin',
      },
      {
        name: 'Başlangıç ve bitiş konumlarını seçin',
        children: <Step1Markers trip={trip} onChangeTrip={handleChangeTrip} />,
        continueCondition: Boolean(trip?.route),
        nextTitle: 'Devam edin',
      },
      {
        name: 'Devam etmek için telefon numaranızı girin',
        children: <Step01Phone trip={trip} onChangeTrip={handleChangeTrip} />,
        continueCondition: Boolean(trip?.contact?.phone),
        nextTitle: 'Tarih seçin',
        onNext: handleNonFinish,
      },
      {
        name: 'Sizin için uygun tarihleri seçin',
        children: <Step2Calendar trip={trip} onChangeTrip={handleChangeTrip} />,
        continueCondition: Boolean(trip?.selectedDays?.length),
      },
      {
        name: 'Yükünüz hakkında kısaca bilgi verin',
        children: <Step3Textarea trip={trip} onChangeTrip={handleChangeTrip} />,
        continueCondition: Number(trip?.information?.length) > 2,
      },
      {
        name: 'İletişim bilgileriniz',
        continueCondition:
          Number(trip?.contact?.firstName?.length) > 2 &&
          Number(trip?.contact?.phone?.length) > 2,
        onNext: handleNonFinish,
        children: <Step4Contact trip={trip} onChangeTrip={handleChangeTrip} />,
      },

      {
        name: 'Özet',
        children: <Step5Summary trip={trip} />,
        continueCondition: true,
      },
    ],
    [handleChangeTrip, trip, handleNonFinish]
  )

  const handleFinish = useEvent(() => {
    const email = `
      İletişime geçen müşterimiz <b>${trip?.contact?.firstName}</b>
      <b>${nameConverter(
        trip?.startMarker as GeocodingLocation
      )}</b> konumundan alacağız ve
      <b>${nameConverter(
        trip?.endMarker as GeocodingLocation
      )}</b> konumuna teslim edeceğiz. <br />
      ${
        !Boolean(trip?.helper) &&
        '<span>Herhangi bir yardımcı personel hizmeti istemedi</span>'
      }
      <br />
      Taşıma için müsait olduğunuz günler
      <b>
        ${trip?.selectedDays
          ?.map((day: { date: Date }) => {
            return day.date.toLocaleDateString()
          })
          ?.join(', ')}
      </b>
      . Bu günlerden biri için planlama yapılacaktır.
      <br />
      Yolculuğumuz toplam <b>${Math.floor(trip.route.distance / 1000)}km</b>,
      Talep edeceğimiz ücret ise <b>${calculatePrice(trip)}₺</b>
      olmaktadır.
      <br />
      Yük hakkında verdiği bilgi ise şöyle: <br />
      <b>${trip.information}</b>
      <br />
      Onaylı telefon numarası
      <a href="tel:${trip?.contact?.phone}">${
      trip?.contact?.phone
    }</a> telefonundan ulaşarak rotanızı birlikte
      onaylayacağız.

      <br />
      Onaylı eposta numarası
      <a href="mailto:${trip?.contact?.email}">${trip?.contact?.email}</a> <br/>
      Detaylı Bilgi <br/>
<pre>
      ${JSON.stringify({ ...trip, route: undefined })}</pre>
      `

    clearTimeout(nonFinish.current)
    axios
      .post('/api/mail', { email, name: trip.contact?.firstName })
      .then(() => {
        onSuccess?.()
        setTrip({ carType: 'large' })
      })
  })
  return (
    <div className="w-full  justify-center flex" id="scroll-start">
      <div className="text-left flex flex-col items-center max-w-7xl xl:w-full w-[calc(100%-4rem)]">
        <Steps
          price={Boolean(trip.contact?.phone) && Boolean(trip.selectedDays) ? price : undefined}
          stepData={steps}
          className="mt-8"
          onChangeStep={() => {}}
          onFinish={handleFinish}
        />
      </div>
    </div>
  )
}

export default Map
