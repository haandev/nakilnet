import Head from 'next/head'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import { HeaderBanner } from '../components/HeaderBanner'
import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { Footer } from '../components/Footer'
import { useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
const Map: any = dynamic(
  () => import('../components/Map').then((mod) => mod.Map),
  {
    ssr: false,
  }
)

const inter = Inter({ subsets: ['latin'] })

const Modal = ({ onClose }) => (
  <div
    className="relative z-[9999]"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg font-medium leading-6 text-gray-900"
                  id="modal-title"
                >
                  Talebiniz alındı
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Operasyon ekibimiz en 15 dakika içerisinde sizinle iletişime
                    geçecek ve rotanızı planlayacağız.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              onClick={() => onClose()}
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Tamam
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default function Home() {
  const [showModal, setShowModal] = useState<boolean>(false)
  return (
    <>
      <Head>
        <title>kargonet | uluslararas kargo gönderimi ve parsiyel taşımacılık</title>
        <meta
          name="description"
          content="kargonet | uluslararas kargo gönderimi ve parsiyel taşımacılık | kargo göndermenin kolay hali | hız güven emniyet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Analytics/>
      <main className={styles.main}>
        {showModal && <Modal onClose={() => setShowModal(false)} />}
        <HeaderBanner />
        <Header />
        <Hero />
        <Map onSuccess={() => setShowModal(true)} />
        <Footer />
      </main>
    </>
  )
}
