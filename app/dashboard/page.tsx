'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown, Trash2 } from "lucide-react"
import Image from 'next/image'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

interface Video {
  id: string
  title: string
  votes: number
  thumbnail: string
}

export default function Component() {
  const [videoUrl, setVideoUrl] = useState('')
  const [videoQueue, setVideoQueue] = useState<Video[]>([
    { id: 'dQw4w9WgXcQ', title: 'Rick Astley - Never Gonna Give You Up', votes: 5, thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/default.jpg' },
    { id: 'kJQP7kiw5Fk', title: 'Luis Fonsi - Despacito ft. Daddy Yankee', votes: 4, thumbnail: 'https://img.youtube.com/vi/kJQP7kiw5Fk/default.jpg' },
    { id: 'JGwWNGJdvx8', title: 'Ed Sheeran - Shape of You', votes: 2, thumbnail: 'https://img.youtube.com/vi/JGwWNGJdvx8/default.jpg' },
  ])

  // Remove the logic after dev
  const insertStreams = async () => {
    const userDetailsResponse = await fetch("/api/userContext");
    
    if (!userDetailsResponse.ok) {
        console.log("Failed to fetch user details");
        return NextResponse.json({
            message: "failed to fetch user details"
        });
    }

    const userDetails = await userDetailsResponse.json();
    const userId = userDetails.id;

    try {
        // Using Promise.all to handle multiple async calls
        await Promise.all(videoQueue.map(async (video) => {
            const response = await fetch("/api/streams", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    creatorId: userId,
                    url: `https://www.youtube.com/watch?v=${video.id}`, // Corrected template literal
                }),
            });

            const result = await response.json();

            if (response.ok) {
                console.log("Stream added successfully:", result);
            } else {
                console.error("Failed to insert stream:", result.message);
            }
        }));
    } catch (error) {
        console.error("Error inserting streams:", error);
      } 
  };
  const [isFirstLoad, setIsFirstLoad] = useState(true); 
  useEffect(() => {
    if (isFirstLoad) {
      insertStreams(); 
      setIsFirstLoad(false); 
    }
  }, [isFirstLoad]); 
  

  const [currentVideo, setCurrentVideo] = useState<Video>({
    id: 'dQw4w9WgXcQ',
    title: 'Rick Astley - Never Gonna Give You Up',
    votes: 0,
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/default.jpg'
  })

  const REFRESH_INTERVAL_MS = 10 * 1000;

  async function refreshStreams() {
    const res = await fetch(`/api/streams/my`, {
        credentials: "include"
    })
    console.log(res);
  }

  useEffect(() => {
    refreshStreams();
    const interval = setInterval(() => {

    }, REFRESH_INTERVAL_MS)
  }, [])

  const addVideo = async () => {
    const videoId = extractVideoId(videoUrl)
    if (videoId) {
      try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=YOUR_YOUTUBE_API_KEY`)
        const data = await response.json()
        if (data.items && data.items.length > 0) {
          const videoDetails = data.items[0].snippet
          setVideoQueue(prevQueue => [...prevQueue, {
            id: videoId,
            title: videoDetails.title,
            votes: 0,
            thumbnail: videoDetails.thumbnails.default.url
          }])
          setVideoUrl('')
        }
      } catch (error) {
        console.error('Error fetching video details:', error)
      }
    }
  }

  const extractVideoId = (url: string) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  const vote = async (index: number, amount: number) => {
    try {
      const response = await fetch(`/api/streams/?extractedId=${videoQueue[index].id}`)
      const data = await response.json()
      const streamId = data.streamId;
      
      if (!streamId) {
        console.log("streamId is wrong")
        return
      }
      
      const upvoteResponse = await fetch("/api/streams/upvote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          streamId: streamId
        })
      });
      const responseJson = await upvoteResponse.json();
      if (upvoteResponse.ok && responseJson.message !=="Removing the upvote") {
        setVideoQueue(prevQueue => {
          const newQueue = prevQueue.map((video, i) => {
            if (i === index) {
              return { ...video, votes: video.votes + amount }
            }
            return video
          })
          return newQueue.sort((a, b) => b.votes - a.votes)
        })
      } else if(responseJson.message === "Removing the upvote"){
            console.log(responseJson.message)
            setVideoQueue(prevQueue => {
              const newQueue = prevQueue.map((video, i) => {
                if (i === index) {
                  return { ...video, votes: video.votes - amount }
                }
                return video
              })
              return newQueue.sort((a, b) => b.votes - a.votes)
            })
          }
          else{
            console.log(responseJson.message);
          }
        }
    catch (error) {
      console.error("Error during voting:", error)
    }
  }
  

  const removeVideo = (index: number) => {
    setVideoQueue(prevQueue => prevQueue.filter((_, i) => i !== index))
  }

  const playNext = () => {
    setVideoQueue(prevQueue => {
      if (prevQueue.length > 0) {
        setCurrentVideo(prevQueue[0])
        return prevQueue.slice(1)
      }
      return prevQueue
    })
  }

  return (
    
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
    
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold text-center mb-6">Song Voting Queue</h1>
        <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">Get Started</Button>
        
        {/* Currently playing video */}
        <div className="space-y-4">
          <div className="aspect-video rounded-lg overflow-hidden">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${currentVideo.id}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Currently playing video"
            ></iframe>
          </div>
          <h2 className="text-xl font-semibold text-center">{currentVideo.title}</h2>
          <Button onClick={playNext} size="lg" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            Play Next Song
          </Button>
        </div>

        {/* Input for new video */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2">Add a new video</h2>
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Enter YouTube URL"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                aria-label="YouTube URL input"
                className="bg-gray-700 text-gray-100 border-gray-600 focus:border-purple-400"
              />
              <Button onClick={addVideo} size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                Add
              </Button>
            </div>
            {videoUrl && extractVideoId(videoUrl) && (
              <div className="mt-4 aspect-video rounded-lg overflow-hidden">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${extractVideoId(videoUrl)}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Video preview"
                ></iframe>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Video queue */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2">Upcoming Videos</h2>
            <ul className="space-y-4">
              {videoQueue.map((video, index) => (
                <li key={video.id} className="flex items-center justify-between bg-gray-700 p-2 rounded">
                  <div className="flex items-center space-x-4">
                    <Image
                      src={video.thumbnail}
                      alt={`Thumbnail for ${video.title}`}
                      width={120}
                      height={90}
                      className="rounded"
                    />
                    <span className="font-medium">{video.title}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold">{video.votes} votes</span>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => vote(index, 1)}
                      aria-label={`Upvote ${video.title}`}
                      className="border-purple-400 text-purple-400 hover:bg-purple-400/10"
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => vote(index, -1)}
                      aria-label={`Downvote ${video.title}`}
                      className="border-purple-400 text-purple-400 hover:bg-purple-400/10"
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => removeVideo(index)}
                      aria-label={`Remove ${video.title} from queue`}
                      className="border-purple-400 text-purple-400 hover:bg-purple-400/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}