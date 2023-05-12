import * as SecureStore from "expo-secure-store";

type OptionPayload = {
  replaceCharacter?: string;
  replacer?: typeof defaultReplacer;
};

function defaultReplacer(key: string, replaceCharacter: string) {
  return key.replace(/[^a-z0-9.\-_]/gi, replaceCharacter);
}

export default function createSecureStorage(
  options = {} as SecureStore.SecureStoreOptions & OptionPayload
) {
  const replaceCharacter = options.replaceCharacter || "_";
  const replacer = options.replacer || defaultReplacer;

  return {
    getItem: (key: string) =>
      SecureStore.getItemAsync(replacer(key, replaceCharacter), options),
    setItem: (key: string, value: string) =>
      SecureStore.setItemAsync(replacer(key, replaceCharacter), value, options),
    removeItem: (key: string) =>
      SecureStore.deleteItemAsync(replacer(key, replaceCharacter), options),
  };
}
