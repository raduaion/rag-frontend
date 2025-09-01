import Layout from "@/components/layout"
import Head from "next/head"

function HowItWorks() {

  return (
    <Layout>

      <Head>
        <title>How It Works - Hermes</title>
        <meta name="description" content="Upload, manage, and share professional information effortlessly." />
      </Head>

      <div className="my-10">

        <section className="bg-white shadow p-6 m-4 rounded max-w-screen-xl mx-auto">

          <div className="w-[90%] mx-auto my-8 min-h-96">

            <h2 className="text-3xl md:text-4xl font-bold my-8">
              How It Works
            </h2>

            <hr className="h-px my-8 bg-gray-200 border-0" />

            <ul className="list-disc pl-6 space-y-2 text-lg">
              <li>Upload files to create collection.</li>
              <li>Manage your collections and make them public or private.</li>
              <li>Search for public collections shared by others.</li>
            </ul>

          </div>
        </section>
      </div>

    </Layout>
  )
}

export default HowItWorks
