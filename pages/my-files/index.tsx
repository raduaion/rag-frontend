import Layout from "@/components/layout"
import Head from "next/head"
import MyFilesRom from "./MyFilesRom"

export default function MyFiles() {

  return (
    <Layout>

      <Head>
        <title>My Files - Hermes</title>
        <meta name="description" content="Manage your files." />
      </Head>

      <MyFilesRom />

    </Layout>
  )
}
