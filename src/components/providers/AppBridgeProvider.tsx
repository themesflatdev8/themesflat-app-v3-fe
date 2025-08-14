// import { useState } from "react";
// import { useRouter } from 'next/router'
// import { Provider } from "@shopify/app-bridge-react";
// import { Banner, Layout, Page } from "@shopify/polaris";
// import { SHOPIFY_API_KEY } from '@/config/env'

// type Props = {
//   children: React.ReactNode
// }

// /**
//  * A component to configure App Bridge.
//  * @desc A thin wrapper around AppBridgeProvider that provides the following capabilities:
//  *
//  * 1. Ensures that navigating inside the app updates the host URL.
//  * 2. Configures the App Bridge Provider, which unlocks functionality provided by the host.
//  *
//  * See: https://shopify.dev/apps/tools/app-bridge/react-components
//  */
// export function AppBridgeProvider({ children }: Props) {
//   const router = useRouter()

//   const { query } = router
//   let host: any = query.host

//   // The host may be present initially, but later removed by navigation.
//   // By caching this in state, we ensure that the host is never lost.
//   // During the lifecycle of an app, these values should never be updated anyway.
//   // Using state in this way is preferable to useMemo.
//   // See: https://stackoverflow.com/questions/60482318/version-of-usememo-for-caching-a-value-that-will-never-change

//   const [appBridgeConfig]: any = useState(() => {
//     return {
//       host,
//       apiKey: SHOPIFY_API_KEY,
//       forceRedirect: false,
//     };
//   });

//   if (!SHOPIFY_API_KEY) {
//     return (
//       <Page narrowWidth>
//         <Layout>
//           <Layout.Section>
//             <div style={{ marginTop: "100px" }}>
//               <Banner title="Missing Shopify API key" tone="critical">
//                 Your app is running without the SHOPIFY_API_KEY environment
//                 variable. Please ensure that it is set when running or building
//                 your React app.
//               </Banner>
//             </div>
//           </Layout.Section>
//         </Layout>
//       </Page>
//     );
//   }

//   return (
//     <Provider config={appBridgeConfig}>
//       {children}
//     </Provider>
//   );
// }

export {};
