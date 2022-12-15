import React, { useState } from "react"
import { useEffect } from "react"

export interface Step3TextareaProps {
  onChangeTrip?: (trip: any) => void
  trip?: any
}
const Step3Textarea: React.FC<Step3TextareaProps> = ({
  onChangeTrip,
  trip,
}) => {
  const [info, setInfo] = useState<string>(trip?.information || "")
  useEffect(() => {
    onChangeTrip?.((prev: any) => ({ ...prev, information: info }))
  }, [info, onChangeTrip])

  return (
    <div className="w-full">
      <div className="max-w-7xl w-full  mx-auto  h-100">
        <textarea
          onChange={(e) => setInfo(e?.currentTarget.value)}
          rows={4}
          name="comment"
          id="comment"
          className="shadow-sm p-3 focus:ring-red-700 focus:border-red-700 h-[200px] block w-full sm:text-sm border-solid border-[1px] border-gray-300 rounded-md"
          defaultValue={info}
          placeholder="Yükünüz hakkında kısa bir bilgi veriniz. Örneğin: 'Bir palet kağıt' veya '30 koli tekstil ürünü' gibi"
        />
      </div>
      <div className="flex-col flex">
        <div className="flex flex-row mt-8 justify-between items-center">
          <h1 className="text-gray-700 font-bold flex flex-col justify-start items-start md:items-center md:flex-row "> <span> Yardımcı hizmeti (Yakında)</span>
          
          
        <span className="text-xs font-normal text-gray-500  md:ml-3 md:mt-1 mt-2">Araç ile birlikte gönderilmeisni istediğiniz taşıma personeli sayısını bildirin. </span>

          </h1>
              <div className=" ml-4 self-start h-10 w-32 flex flex-row rounded-lg relative bg-transparent mt-1">
                <button
                  data-action="decrement"
                  className=" bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none">
                  <span className="m-auto text-2xl font-thin">−</span>
                </button>
                <input
                  type="number"
                  disabled
                  className="pl-2 appearance-none outline-none focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black  md:text-base cursor-default flex items-center text-gray-700"
                  name="custom-input-number"
                  value="0"
                />
                <button
                  data-action="increment"
                  className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer">
                  <span className="m-auto text-2xl font-thin">+</span>
                </button>
              </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(Step3Textarea)
