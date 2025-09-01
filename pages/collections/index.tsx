import Layout from "@/components/layout"
import Head from "next/head"
import Collections from "./Collections"

export default function MyCollections() {

  return (
    <Layout>

      <Head>
        <title>Collections - Hermes</title>
        <meta name="description" content="Manage my collections." />
      </Head>

      <Collections isPublicPath={ false } />

    </Layout>
  )
}
