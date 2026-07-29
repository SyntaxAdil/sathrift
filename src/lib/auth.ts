import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { expo } from "@better-auth/expo";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.DATABASE_URL!);

const db = client.db("sathrift");

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  plugins: [expo()],
  emailAndPassword: { enabled: true },
  trustedOrigins: [
    "project3auth://",
    "project3auth://*",
    ...(process.env.NODE_ENV === "development"
      ? ["exp://", "exp://**", "exp://192.168.*.*:*/**"]
      : []),
  ],
});