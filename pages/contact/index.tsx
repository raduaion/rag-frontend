import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'

const Contact = () => {

  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Contact - Hermes</title>
      </Head>
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Image src="/img/HermesLogo.png" alt="Hermes Logo" className="h-16 -mt-4 -mb-4 mr-2" width={64} height={64}/>
          <h1 className="text-3xl font-bold">Contact</h1>
        </div>
        <button
          className="bg-white text-blue-600 px-4 py-2 rounded"
          onClick={() => router.push('/')}
        >
          Back to Home
        </button>
      </header>
      <main className="flex-1 p-6 bg-gray-100">
        <section className="bg-white shadow p-6 m-4 rounded max-w-screen-xl mx-auto">

          <div className="w-[90%] mx-auto my-8 min-h-96">

            <h2 className="text-3xl md:text-4xl font-bold my-8">
              Contact
            </h2>

            <hr className="h-px my-8 bg-gray-200 border-0"></hr>
          </div>
        </section>
      </main>
      <footer className="bg-gray-800 text-white text-center p-4">
        <p>&copy; 2025 Hermes</p>
      </footer>
    </div>
  )
}

export default Contact
