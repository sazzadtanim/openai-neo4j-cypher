import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { IconArrowRight } from '@/components/ui/icons'

const exampleMessages = [
  {
    heading: 'List of customers who insureded by specific company',
    message: `Give me the list of all customers who are insured by Catalana Occidente`
  },
  {
    heading: 'List of customers who live in a specific neighborhood',
    message: 'Give me the list of all customers who live in Sur'
  },
  {
    heading: 'Find claims made by a specific customer',
    message: `Give me the list of all claims made by Juliana Baena Egea`
  },
  {
    heading: 'List of vehicles owned by a specific customer',
    message: `Give me the list of all vehicles that are owned by Germán Huerta Tena`
  },
  {
    heading: 'List of the jobs of a customer ',
    message: `Give me the list of the jobs occupied by Germán Huerta Tena`
  }
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">
          Welcome to Oxilate AI Chatbot!
        </h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          This is an AI chatbot app created by Oxilate.
        </p>
        <p className="leading-normal text-muted-foreground">
          You can start a conversation here or try the following examples:
        </p>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={() => setInput(message.message)}
            >
              <IconArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
