import Layout from "@/components/layout"
import Head from "next/head"
import ChatRoom from "./ChatRoom"

export default function ChatZone() {

  return (
    <Layout onlyLayout>

      <Head>
        <title>Conversation - Hermes</title>
        <meta name="description" content="Chat with Hermes." />
      </Head>

      <ChatRoom />

    </Layout>
  )
}
