import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import { prisma } from "@repo/db/client"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        Credentials({
            name: "credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "Enter your email"
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "Enter your password"
                }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required")
                }

                try {
                    // Find user by email
                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials.email
                        }
                    })

                    if (!user || !user.password) {
                        // Don't reveal whether user exists or not
                        throw new Error("Invalid credentials")
                    }

                    // Verify password
                    const isPasswordValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    )

                    if (!isPasswordValid) {
                        throw new Error("Invalid credentials")
                    }

                    // Return user object (without password)
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                    }
                } catch (error) {
                    console.error("Authentication error:", error)
                    throw new Error("Authentication failed")
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user, account }) {
            // Persist the OAuth access_token and user id to the token right after signin
            if (account && user) {
                token.userId = user.id
                token.accessToken = account.access_token
            }
            return token
        },
        async session({ session, token }: any) {
            // Send properties to the client
            if (token && session.user) {
                session.user.id = token.userId as string
                session.accessToken = token.accessToken
            }
            return session
        },
        async signIn({ user, account, profile }) {
            // Handle Google OAuth sign in
            if (account?.provider === "google") {
                try {
                    // Check if user already exists
                    const existingUser = await prisma.user.findUnique({
                        where: { email: user.email! }
                    })

                    if (existingUser) {
                        // User exists, allow sign in
                        return true
                    }

                    // New user, will be created by PrismaAdapter
                    return true
                } catch (error) {
                    console.error("Sign in error:", error)
                    return false
                }
            }

            // Handle credentials sign in
            if (account?.provider === "credentials") {
                return true
            }

            return true
        }
    },
    pages: {
        signIn: "/auth/signin",
    },
    events: {
        async signIn({ user, account, isNewUser }) {
            console.log(`User ${user.email} signed in via ${account?.provider}`)
            if (isNewUser) {
                console.log(`New user created: ${user.email}`)
            }
        },
        async signOut({ session }) {
            console.log(`User signed out: ${session?.user?.email}`)
        }
    },
    debug: process.env.NODE_ENV === "development",
}