'use client'
import { Provider } from 'react-redux'
import { persistor, store } from "@/redux/store";
import { PersistGate } from 'redux-persist/integration/react';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return ( 
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
          {/* {bootstrapped => bootstrapped ? children : null} */}
          {children}
      </PersistGate>
    </Provider>
  )
}




  // return ( 
  //   <Provider store={store}>
  //     <PersistGate loading={null} persistor={persistor}>
  //       {children}
  //     </PersistGate>
  //   </Provider>
  // )


// export default function ClientProviders({ children }: { children: React.ReactNode }) {
//   return <Provider store={store}>{children}</Provider>
// }