import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'

const About: React.FC = () => {

  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col">

      <Head>
        <title>About Hermes</title>
      </Head>

      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Image src="/img/HermesLogo.png" alt="Hermes Logo" className="h-16 -mt-4 -mb-4 mr-2" width={64} height={64}/>
          <h1 className="text-3xl font-bold">About Hermes</h1>
        </div>
        <button
          className="bg-white text-blue-600 px-4 py-2 rounded"
          onClick={() => router.push('/')}>
          Back to Home
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center text-center p-8 bg-gray-100">
        <div className="flex flex-col md:flex-row items-center gap-y-8 px-10 py-16">
          <Image src="/img/HermesLogo3.png" alt="Hermes Detailed Logo" className="max-w-md rounded shadow-md md:mr-12" width={450} height={450}/>
          <div className="text-left flex-1">
            <section className="bg-white p-14 shadow rounded-lg max-w-4xl flex-1">
              <h2 className="text-2xl font-bold mb-4">What is Hermes?</h2>
              <p className="text-lg mb-4">
                Hermes is a cutting-edge platform designed to simplify the management and sharing of professional information.
                With Hermes, users can effortlessly upload their documents, create searchable collections, and share them with collaborators or the wider community.
              </p>
              <h2 className="text-2xl font-bold mb-4">Key Features</h2>
              <ul className="list-disc pl-6 space-y-2 text-lg">
                <li>Upload and categorize files such as PDFs, spreadsheets, and presentations.</li>
                <li>Create intelligent collections from your files for efficient search and retrieval.</li>
                <li>Share your collections publicly or privately with others.</li>
                <li>Search and utilize public collections created by the community.</li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white text-center p-4">
        <p>&copy; 2025 Hermes</p>
      </footer>
    </div>
  )
}

export default About
