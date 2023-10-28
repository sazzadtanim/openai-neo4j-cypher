import neo4j from 'neo4j-driver';

const driver = neo4j.driver(
  process.env.NEO4J_URI ?? '',
  neo4j.auth.basic(
    process.env.NEO4J_USERNAME ?? '',
    process.env.NEO4J_PASSWORD ?? ''
  )
)

export async function extractCyperQueryFromGpt(
  result: Response
): Promise<{ isCypherQuery: boolean; cypherQuery: string }> {
  let message: { content: '' } = { content: '' }
  const cypherFunction = [
    'ALTER',
    'CALL',
    'CREATE',
    'DEALLOCATE',
    'DELETE',
    'DENY',
    'DETACH',
    'DROP',
    'DRYRUN',
    'ENABLE',
    'FOREACH',
    'GRANT',
    'LOAD',
    'MATCH',
    'MERGE',
    'OPTIONAL',
    'REALLOCATE',
    'REMOVE',
    'RENAME',
    'RETURN',
    'REVOKE',
    'SET',
    'SHOW',
    'START',
    'STOP',
    'TERMINATE',
    'UNWIND',
    'USE',
    'USING',
    'WITH'
  ]

  try {
    const jsonData = await result.json()
    try {
      message = await jsonData.choices[0].message
    } catch (error) {
      return { isCypherQuery: false, cypherQuery: JSON.stringify(error) }
    }

    const findings = cypherFunction.find(tag => message.content.includes(tag))

    return {
      cypherQuery: message.content,
      isCypherQuery: findings ? true : false
    }
  } catch (error) {
    return { cypherQuery: JSON.stringify(error), isCypherQuery: false }
  }
}

export function neo4jStream(
  cypher: string,
  params = {}
): ReadableStream<Uint8Array> {
  try {
    // 1. Open a session
    const session = driver.session()

    // 2. Execute a Cypher Statement
    const result = session.run(cypher, params)

    // added a counter to solve empty stream problem when query is not right
    let recordCount = 0

    // 3. Create a ReadableStream
    const readableStream = new ReadableStream<Uint8Array>({
      start(controller) {
        result.subscribe({
          onNext: record => {
            const value = record.toObject()
            recordCount++
            const desiredString = Object.entries(value)
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ')
            const chunk = new TextEncoder().encode(`${desiredString} \n\n`)
            controller.enqueue(chunk)
          },
          onCompleted: () => {
            if (recordCount === 0) {
              const chunk = new TextEncoder().encode(
                `No results retrieved from the database, kindly verify the spelling.`
              )
              console.log('query: ' + cypher)
              controller.enqueue(chunk)
            }
            controller.close()
            session.close()
          },
          onError: error => {
            controller.error(error)
            session.close()
          }
        })
      }
    })

    return readableStream
  } catch (error) {
    console.log('Error in neo4jStream:', error)
    throw error // Optionally re-throw the error to propagate it further
  }
}
