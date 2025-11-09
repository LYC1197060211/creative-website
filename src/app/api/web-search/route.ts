import { NextResponse } from 'next/server'

const WEB_SEARCH_ENDPOINT = 'https://open.bigmodel.cn/api/paas/v4/web_search'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      search_query: searchQuery,
      apiKey,
      search_engine: searchEngine = 'search_std',
      search_intent: searchIntent = true,
      count = 8,
      content_size: contentSize = 'medium',
    } = body || {}

    if (!searchQuery) {
      return NextResponse.json({ error: 'Missing search_query' }, { status: 400 })
    }

    const finalApiKey =
      apiKey || process.env.GLM_API_KEY || process.env.NEXT_PUBLIC_GLM_API_KEY

    if (!finalApiKey) {
      return NextResponse.json({ error: 'Missing API key' }, { status: 400 })
    }

    const payload = {
      search_query: searchQuery,
      search_engine: searchEngine,
      search_intent: searchIntent,
      count,
      content_size: contentSize,
    }

    const response = await fetch(WEB_SEARCH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${finalApiKey}`,
      },
      body: JSON.stringify(payload),
    })

    const text = await response.text()
    return new NextResponse(text, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
      },
    })
  } catch (error) {
    console.error('Web search proxy error:', error)
    return NextResponse.json({ error: 'Web search proxy error' }, { status: 500 })
  }
}
