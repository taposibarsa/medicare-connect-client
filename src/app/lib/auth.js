import { betterAuth } from "better-auth";
import { MongoClient, ObjectId } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db();

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client,
    }),

    secret: process.env.BETTER_AUTH_SECRET,

    emailAndPassword: {
        enabled: true,
    },

    baseURL: process.env.BETTER_AUTH_URL,

    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "patient",
                input: true,
            },
            phone: {
                type: "string",
                required: false,
                input: true,
            },
            gender: {
                type: "string",
                required: false,
                input: true,
            },
            status: {
                type: "string",
                required: false,
                defaultValue: "active",
            },
        },
    },

    databaseHooks: {
        user: {
            create: {
                after: async (user) => {
                    if (user.image) {
                        await db.collection("user").updateOne(
                            { _id: new ObjectId(user.id) },
                            { $set: { photo: user.image } }
                        );
                    }
                },
            },
            update: {
                after: async (user) => {
                    if (user.image) {
                        await db.collection("user").updateOne(
                            { _id: new ObjectId(user.id) },
                            { $set: { photo: user.image } }
                        );
                    }
                },
            },
        },
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
    },
});
