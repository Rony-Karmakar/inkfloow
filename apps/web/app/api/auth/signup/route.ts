import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@repo/db/client"
import bcrypt from "bcrypt"

export async function POST(request: NextRequest) {
    try {
        const { name, email, password } = await request.json()

        // Validation
        if (!name || !email || !password) {
            return NextResponse.json(
                { message: 'Name, email, and password are required' },
                { status: 400 }
            )
        }

        if (password.length < 6) {
            return NextResponse.json(
                { message: 'Password must be at least 6 characters long' },
                { status: 400 }
            )
        }

        // Email validation
        const emailRegex = /\S+@\S+\.\S+/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { message: 'Please provide a valid email address' },
                { status: 400 }
            )
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        })

        if (existingUser) {
            return NextResponse.json(
                { message: 'An account with this email already exists' },
                { status: 400 }
            )
        }

        // Hash password
        const saltRounds = 12
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        // Create user
        const user = await prisma.user.create({
            data: {
                name: name.trim(),
                email: email.toLowerCase(),
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            }
        })

        return NextResponse.json(
            {
                message: 'Account created successfully',
                user: user
            },
            { status: 201 }
        )

    } catch (error: any) {
        console.error('Signup error:', error)

        // Handle specific Prisma errors
        if (error.code === 'P2002') {
            return NextResponse.json(
                { message: 'An account with this email already exists' },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { message: 'Internal server error. Please try again.' },
            { status: 500 }
        )
    }
}