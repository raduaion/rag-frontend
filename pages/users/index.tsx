import Head from "next/head"
import Layout from "@/components/layout"
import ManageUsers from "./ManageUsers"

export default function Users() {

  return (
    <Layout className="flex-grow">

      <Head>
        <title>Users - Hermes</title>
        <meta name="description" content="Manage users - Approve or Reject login requests" />
      </Head>

      <ManageUsers />

    </Layout>
  )
}
