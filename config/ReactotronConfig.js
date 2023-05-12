// import Reactotron from "reactotron-react-native";
// import { reactotronRedux } from "reactotron-redux";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// Reactotron.configure({ name: "app_name" })
//   .setAsyncStorageHandler(AsyncStorage)
//   .useReactNative()
//   .use(reactotronRedux()) //  <- here i am!
//   .connect();

// //  patch console.log to send log to reactotron
// // const yeOldeConsoleLog = console.log;
// // console.log = (...args) => {
// //   yeOldeConsoleLog(...args);
// //   Reactotron.display({
// //     name: "daily-cashier",
// //     value: args,
// //     preview: args.length > 0 && typeof args[0] === "string" ? args[0] : null,
// //   });
// // };

// export default Reactotron;
