import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params
  const views = await redis.incr(`noticia:visitas:${slug}`)
  return NextResponse.json({ views })
}

export const dynamic = 'force-dynamic' // necesario en Next.js 13+ para que no se cachee
