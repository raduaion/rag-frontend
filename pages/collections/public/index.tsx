import Layout from "@/components/layout"
import Head from "next/head"
import Collections from "../Collections"

export default function MyCollections() {

  return (
    <Layout>

      <Head>
        <title>Public collections - Hermes</title>
        <meta name="description" content="Here you can see public collections." />
      </Head>

      <Collections isPublicPath />

    </Layout>
  )
}
