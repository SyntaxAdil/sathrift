import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

import type { BetterAuthClientPlugin } from "better-auth/types";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [
    expoClient({
      scheme: "sathrift",
      storagePrefix: "sathrift",
      storage: SecureStore,
    }) as any,
  ],
});
