import Head from "next/head"
import Layout from "@/components/layout"
import ManageUserAccount from "./UserAccount"
import { RootState } from "@/redux/store"
import { connect } from "react-redux"
import UserAccount from "@/libs/UserAccount"

interface StateProps {
  account: UserAccount
}

function UserAccountLayout({ account: { userData }}: StateProps) {

  return (
    <Layout>

      <Head>
        <title>Account - Hermes</title>
        <meta name="description" content="Manage my account" />
      </Head>

      <ManageUserAccount user={ userData } />

    </Layout>
  )
}

const mapStateToProps = (state: RootState) => {
  const { account } = state
  return { account }
}

export default connect(mapStateToProps)(UserAccountLayout)
