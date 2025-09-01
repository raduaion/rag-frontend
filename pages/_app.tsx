import { wrapper } from "@/redux/store"
import type { AppProps } from "next/app"
import Head from 'next/head'
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { NextPage } from "next"
import { ReactElement, ReactNode } from "react"
import "@/styles/globals.css"

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, ...rest }: AppPropsWithLayout) {

  const { store, props } = wrapper.useWrappedStore(rest),

  persistor = store.__persistor,

  getLayout = Component.getLayout ?? ((page) => page)

  return (
    <>
      <Head>
        <link rel="icon" href="/HermesLogo.ico" />
        <title>Hermes</title>
      </Head>

      <Provider store={store}>
        <PersistGate loading={<div>Loading storage</div>} persistor={ persistor }>
          { getLayout(<Component {...props.pageProps} />) }
        </PersistGate>
      </Provider>
    </>
  )
}
