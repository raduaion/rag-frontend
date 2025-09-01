
import Head from 'next/head'
import Image from 'next/image'
import WelcomeBack from './tabs/WelcomeBack'
import Layout from '@/components/layout'
import { connect } from 'react-redux'
import { RootState } from '@/redux/store'
import UserAccount from '@/libs/UserAccount'

interface StateProps {
  account: UserAccount
}

const Home = ({ account: { userData } }: StateProps) => {

  return (
    <Layout>

      <Head>
        <title>Hermes</title>
        <meta name="description" content="Upload, manage, and share professional information effortlessly." />
      </Head>

      <div className="px-6 m-4 mx-auto">

        { userData 
          ? <WelcomeBack userInfo={ userData } /> 
          : (
          <main className="flex-1 flex items-center justify-center text-center sm:p-8 bg-gray-100">
            <div className="flex flex-col md:flex-row items-center gap-y-8 sm:px-10 sm:py-16 md:gap-x-16">
              <div className="text-left flex-1 md:mr-6">
                <h1 className="text-4xl font-bold mb-6">Welcome to Hermes</h1>
                <p className="text-lg leading-relaxed">
                  <span className="text-blue-600 font-bold text-2xl">Hermes: Redefining Professional Information Management</span>
                  <br />
                  <br />
                  Hermes empowers users to seamlessly upload, organize, and share professional information with unparalleled ease. Supporting intuitive file handling, Hermes integrates advanced features such as bulk uploads, cloud-based storage, and comprehensive sharing capabilities.
                  <br />
                  <br />
                  The platform ensures robust security, accessibility, and collaboration, making it an indispensable tool for individuals and teams seeking efficient information management. With Hermes, you can confidently manage critical documents, maintain version control, and create indexed collections tailored to your needs—all within a user-friendly interface.
                </p>
              </div>
              <Image src="/img/Hermes.webp" alt="Hermes" className="w-[120%] max-w-sm md:max-w-lg rounded shadow-md md:ml-12" width={200} height={200}/>
            </div>
          </main>
        )}

      </div>
    </Layout>
  )
}

const mapStateToProps = (state: RootState) => {
  const { account } = state
  return { account }
}

export default connect(mapStateToProps)(Home)
