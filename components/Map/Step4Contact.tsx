import React, { useState } from "react"
import { useEffect } from "react"

export interface Step4ContactProps {
  onChangeTrip?: (trip: any) => void
  trip?: any
}
const Step4Contact: React.FC<Step4ContactProps> = ({ onChangeTrip, trip }) => {
  const [contact, setContact] = useState<any>(trip?.contact || {})
  useEffect(() => {
    onChangeTrip?.((prev: any) => ({ ...prev, contact: contact }))
  }, [contact, onChangeTrip])

  return (
    <div className="w-full">
      <div className="max-w-7xl w-full mx-auto h-100">
        <div className="col-span-6 sm:col-span-3 mb-8">
          <label
            htmlFor="first-name"
            className="block text-sm font-medium text-gray-700">
            Adınız soyadınız
          </label>
          <input
            onChange={(e) =>
              setContact((prev: any) => ({
                ...prev,
                firstName: e?.currentTarget?.value,
              }))
            }
            value={contact.firstName || ""}
            type="text"
            name="first-name"
            id="first-name"
            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:outline-none focus:ring-1 sm:text-sm mt-1 block focus:border-amber-500 focus:ring-amber-500"
          />
        </div>

        <div className="col-span-6 sm:col-span-3 mb-8">
          <label
            htmlFor="first-name"
            className="block text-sm font-medium text-gray-700">
            Varsa işyer ünvanı
          </label>
          <input
            type="text"
            onChange={(e) =>
              setContact((prev: any) => ({
                ...prev,
                title: e?.currentTarget?.value,
              }))
            }
            value={contact.title || ""}
            name="title"
            id="title"
            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:outline-none focus:ring-1 sm:text-sm mt-1 block focus:border-amber-500 focus:ring-amber-500"
          />
        </div>

        <div className="col-span-6 sm:col-span-3 mb-8">
          <label
            htmlFor="first-name"
            className="block text-sm font-medium text-gray-700">
            Telefon numaranız
          </label>
          <input
            type="text"
            onChange={(e) =>
              setContact((prev: any) => ({
                ...prev,
                phone: e?.currentTarget?.value,
              }))
            }
            value={contact.phone || ""}
            name="phone"
            id="phone"
            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:outline-none focus:ring-1 sm:text-sm mt-1 block focus:border-amber-500 focus:ring-amber-500"
          />
        </div>

        <div className="col-span-6 sm:col-span-3 mb-8">
          <label
            htmlFor="first-name"
            className="block text-sm font-medium text-gray-700">
            Varsa eposta adresiniz
          </label>
          <input
            type="text"
            onChange={(e) =>
              setContact((prev: any) => ({
                ...prev,
                email: e?.currentTarget?.value,
              }))
            }
            value={contact.email || ""}
            name="email"
            id="email"
            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:outline-none focus:ring-1 sm:text-sm mt-1 block focus:border-amber-500 focus:ring-amber-500"
          />
        </div>
      </div>
    </div>
  )
}

export default React.memo(Step4Contact)
