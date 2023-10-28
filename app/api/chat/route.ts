import { feedMessages } from '@/lib/util/helper_data'
import {
  extractCyperQueryFromGpt,
  neo4jStream
} from '@/lib/util/helper_functions'
import { StreamingTextResponse } from 'ai'
import {
  ChatCompletionRequestMessage,
  Configuration,
  OpenAIApi
} from 'openai-edge'

export const runtime = 'edge'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)
console.dir({ openai })

export async function POST(req: Request) {
  const json = await req.json()

  const {
    messages,
    previewToken
  }: { messages: ChatCompletionRequestMessage[]; previewToken: string } = json

  const messageWithInstruction = feedMessages.concat(
    messages[messages.length - 1]
  )

  // api protection
  // const userId = (await auth())?.user.id
  // if (!userId) {
  //   return new Response('Unauthorized', {
  //     status: 401
  //   })
  // }

  if (previewToken) {
    configuration.apiKey = previewToken
  }

  try {
    const result = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      // messages: messageWithInstruction,
      messages,
      temperature: 0
    })
    if (result.statusText !== 'Success') {
      return Response.json({ error: result.statusText })
    }

    try {
      const { isCypherQuery, cypherQuery } = await extractCyperQueryFromGpt(
        result
      )

      const responseNeo4j = isCypherQuery
        ? neo4jStream(cypherQuery)
        : cypherQuery

      return new StreamingTextResponse(responseNeo4j as ReadableStream)
    } catch (error) {
      console.error({ error })
      return Response.json({ error })
    }
  } catch (error) {
    console.error({ error })
    return Response.json({ error })
  }
}
