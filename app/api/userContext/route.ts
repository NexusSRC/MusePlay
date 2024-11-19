import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

 
export async function GET(req : NextRequest){
    const session = await getServerSession();
    const userDetails = await prismaClient.user.findFirst({
        where: {
            email : session?.user?.email ?? ""
        }
    })

    if(!userDetails){
        return NextResponse.json({
            message : "Unauthenticated"
        }, {
            status : 403
        })
    }

    return NextResponse.json({
        id : userDetails?.id,
        email : userDetails?.email,
        provider: userDetails?.provider,
    })
}