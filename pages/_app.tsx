import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import type { AppProps } from 'next/app'
import { Web3Provider } from '../components/providers'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

// const client = new ApolloClient({
//   uri: "https://api.thegraph.com/subgraphs/name/iheqi/nft-marketplace",
//   cache: new InMemoryCache(),
// });

// client
//   .query({
//     query: gql`
//       query GetLocations {
//         approvals(first: 5) {
//           id
//           owner
//           approved
//           tokenId
//         }
//         approvalForAlls(first: 5) {
//           id
//           owner
//           operator
//           approved
//         }
//       }
//     `,
//   })
//   .then((result) => console.log("result:", result));

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ToastContainer />
      <Web3Provider>
        <Component {...pageProps} />
      </Web3Provider>
    </>
  )
}
