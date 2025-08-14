export default {};
// import React, {useEffect, useState} from 'react';
// import Router, { useRouter } from "next/router";
// import { useAppBridge } from "@shopify/app-bridge-react";
// import { Redirect, History, ChannelMenu, AppLink } from "@shopify/app-bridge/actions";
// import { RoutePropagator as ShopifyRoutePropagator } from "@shopify/app-bridge-react";
// import { useCommonContext } from "@/contexts/common"
// import _typeReducer from "@/constants/reducer";
// import { ModalConfirm } from '@/components/core';

// const RoutePropagator = () => {
//   const router = useRouter();
//   const { route, asPath } = router;
//   const app = useAppBridge();
//   const history = History.create(app);
//   const [{ leavePageConfirm }, dispatch]: any = useCommonContext()
//   const [visible, setVisible] = useState(false)

//   useEffect(() => {
//     const unsubscribe = app.subscribe(Redirect.Action.APP, ({ path }) => {
//       if(!leavePageConfirm.enable){
//         router.push(path);
//       }else{
//         dispatch({type: _typeReducer.SET_LEAVE_PAGE_CONFIRM, payload: { ...leavePageConfirm, to: path, from: route }})
//         setVisible(true)
//       }
//     });
//     return unsubscribe
//   }, [leavePageConfirm.enable]);

//   const onOkModalConfirm = () => {
//     let routeTo = leavePageConfirm.to
//     router.push(routeTo)
//     setVisible(false)
//     dispatch({type: _typeReducer.SET_LEAVE_PAGE_CONFIRM, payload: { to: "", from: "", enable: false }})
//   }

//   const onCloseModalConfirm = () => {
//     history.dispatch(History.Action.PUSH, leavePageConfirm.from);
//     setVisible(false)
//   }

//   return app && asPath ? (
//     <>

//       <ModalConfirm
//         open={visible}
//         title="Discard changes?"
//         content="You are leaving page with unsaved changes. \nIt might take a long time to start again."
//         checkboxContent="I want to leave and discard changes."
//         okText="Leave and discard "
//         cancelText="Stay"
//         type="checkbox"
//         onOk={() => onOkModalConfirm()}
//         onClose={() => onCloseModalConfirm()}
//         onCancel={() => onCloseModalConfirm()}
//       ></ModalConfirm>

//       <ShopifyRoutePropagator location={asPath} />
//     </>
//   ) : null;
// }

// export default RoutePropagator;

// // import { useEffect } from "react";
// // import { useRouter } from "next/router";
// // import { useAppBridge, useRoutePropagation } from "@shopify/app-bridge-react";
// // import { Redirect } from "@shopify/app-bridge/actions";

// // const RoutePropagator = () => {
// //   const router = useRouter();
// //   const appBridge = useAppBridge();

// //   useRoutePropagation(router.asPath);
// //   /**
// //    * Subscribe to appBridge changes - captures appBridge urls
// //    * and sends them to Next.js router. Use useEffect hook to
// //    * load once when component mounted
// //    */
// //   useEffect(() => {
// //     const unsubscribe = appBridge.subscribe(Redirect.Action.APP, ({ path }) => {
// //       if (router.asPath !== path) {
// //         router.push(path);
// //       }
// //     });

// //     return unsubscribe;
// //   }, [router]);

// //   return null;
// // };

// // export default RoutePropagator
