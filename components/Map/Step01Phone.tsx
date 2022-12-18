import React, { useState } from "react"
import { useEffect } from "react"

export interface Step01PhoneProps {
  onChangeTrip?: (trip: any) => void
  trip?: any
}
const Step01Phone: React.FC<Step01PhoneProps> = ({ onChangeTrip, trip }) => {
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
            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:outline-none focus:ring-1 sm:text-sm mt-1 block focus:border-red-500 focus:ring-red-500"
          />
        </div>

     
      </div>
    </div>
  )
}

export default React.memo(Step01Phone)
