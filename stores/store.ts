import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import { combineReducers, compose } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RedeemReducer from "./RedeemSlice";
import CodeReducer from "./CodeSlice";
import AuthReducer from "./AuthSlice";
import PaymentReducer from "./ListPaymentSlice";
import createSecureStorage from "./secureStore";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
// import Reactotron from "../config/ReactotronConfig";

const rootReducer = combineReducers({
  redeem: RedeemReducer,
  code: CodeReducer,
  payment: PaymentReducer,
});

const secureReducer = combineReducers({
  auth: AuthReducer,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage: AsyncStorage,
  blacklist: [], // blacklisting a store attribute name, will not persist that store attribute.
};

const secureConfig = {
  key: "secure",
  version: 1,
  storage: createSecureStorage(),
  blacklist: [], // blacklisting a store attribute name, will not persist that store attribute.
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const persistedSecureReducer = persistReducer(secureConfig, secureReducer);

const store = configureStore({
  reducer: combineReducers({
    root: persistedReducer,
    secure: persistedSecureReducer,
  }),

  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      // serializableCheck: {
      //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      // },
      serializableCheck: false,
      immutableCheck: false,
    }).concat(thunk),
  // enhancers: [Reactotron.createEnhancer()],
  devTools: false,
});

export const persistor = persistStore(store);
export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
