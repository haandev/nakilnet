import React, { useState } from "react"
import { useEffect } from "react"
import { nameConverter } from "../GeocodeInput/GeocodeInput"
import { calculatePrice } from "./Map"

export interface Step5SummaryProps {
  onChangeTrip?: (trip: any) => void
  trip?: any
}
const Step5Summary: React.FC<Step5SummaryProps> = ({ trip }) => {
  return (
    <div className="w-full">
      <div className="max-w-7xl w-full mx-auto h-100 text-center">
        Merhaba sevgili <b>{trip.contact.firstName}</b>, öncelikle bize olan
        ilginiz için çok teşekkürler. <br />
        Belirtmiş olduğun üzere, yükünüzü{" "}
        <b>{nameConverter(trip.startMarker)}</b> konumundan alacağız ve {" "}
        <b>{nameConverter(trip.endMarker)}</b> konumuna teslim edeceğiz. <br />
        {!Boolean(trip.helper) && (
          <span>
            Herhangi bir yardımcı personel hizmeti istemediğiniz için araç ile
            birlikte sadece şöför göndereceğiz.
          </span>
        )}
        <br />
        Taşıma için müsait olduğunuz günler{" "}
        <b>
          {" "}
          {trip.selectedDays
            .map((day: { date: Date }) => {
              return day.date.toLocaleDateString()
            })
            .join(", ")}
        </b>
        . Bu günlerden biri için planlama yapılacaktır.
        <br />
        Yolculuğumuz toplam <b>{Math.floor(trip.route.distance / 1000)}km</b>,
        Sizden talep edeceğimiz ücret ise <b>{calculatePrice(trip)}₺</b>{" "}
        olmaktadır.
        <br />
        Yükünüz hakkında verdiğiniz bilgi ise şöyle: <br />{" "}
        <b>{trip.information}</b>
        <br />
        Eğer yukarıdaki bilgileri onaylıyorsanız size{" "}
        <b>{trip.contact.phone}</b> telefonundan ulaşarak rotanızı birlikte
        onaylayacağız.
      </div>
    </div>
  )
}

export default React.memo(Step5Summary)
