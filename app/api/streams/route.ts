import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import {z}  from "zod";
//@ts-ignore
import youtubesearchapi  from "youtube-search-api";

var YT_REGEX = /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;

const CreateStreamSchema = z.object({
    creatorId : z.string(), 
    url: z.string()
})

export async function POST (req : NextRequest){
    try{
        const data = CreateStreamSchema.parse(await req.json());
        const isYT = data.url.match(YT_REGEX);
        if(!isYT){
            return NextResponse.json({
                message : "Wrong URL format"
            }, {
                status: 411
            })
        }
        const extractedId = data.url.split("?v=")[1];

        const res = await youtubesearchapi.GetVideoDetails(extractedId);
        console.log(res.title);
        const thumbnails = res.thumbnail.thumbnails;
        thumbnails.sort((a: {width : number}, b: {width : number}) => a.width < b.width ? -1 : 1);
        const stream = await prismaClient.stream.create({
            data: {
                userId: data.creatorId,
                url: data.url,
                extractedId,
                type : "YouTube", 
                title : res.title ?? "You sure you are not delusional?",
                thumbnailSml : (thumbnails.length > 1 ? thumbnails[thumbnails.length-2].url : thumbnails[thumbnails.length-1].url) ?? "https://www.meme-arsenal.com/memes/16616732feb9920563e0e7a487a38d5d.jpg",
                thumbnaidBig : thumbnails[thumbnails.length-1].url ?? "https://www.meme-arsenal.com/memes/16616732feb9920563e0e7a487a38d5d.jpg"
            }
        });
        return NextResponse.json({
            message: "Added stream",
            id : stream.id
        })
    }
    catch(e){
        console.error(e instanceof Error ? e.message : e);
        return NextResponse.json({
            message: "Error while adding a stream"
        },  {
            status: 411
        })
    }
}

export async function GET(req : NextRequest){
    const creatorId = req.nextUrl.searchParams.get("creatorId");
    const extractedId = req.nextUrl.searchParams.get("extractedId");
    if(creatorId){
        const streams = await prismaClient.stream.findMany({
            where : {
                userId : creatorId ?? ""
            }
        })


        return NextResponse.json({
            streams
        })
    }
    if(extractedId){
        const stream = await prismaClient.stream.findFirst({
            where: {
                extractedId: extractedId ?? "" 
            }
        })
        if (!stream) {
            return NextResponse.json({ error: "Stream not found" }, { status: 404 });
        }
        return NextResponse.json({
            streamId : stream?.id
        })
    }
    else{
        return NextResponse.json({
            message: "streamId or extractedId is required"
        }, {
            status: 403
        })
    }   
}

// export async function GET_streamId(req: NextRequest){
//     const str_id = req.nextUrl.searchParams.get("extractedId");
//     if(!str_id){
//         return NextResponse.json({
//             error :  "extractedId is required"
//         },{
//             status : 400
//         })
//     }

//     const stream = await prismaClient.stream.findFirst({
//         where: {
//             extractedId: str_id ?? ""
//         }
//     })
//     if (!stream) {
//         return NextResponse.json({ error: "Stream not found" }, { status: 404 });
//     }
//     return NextResponse.json({
//         streamId : stream?.id
//     })
// } 