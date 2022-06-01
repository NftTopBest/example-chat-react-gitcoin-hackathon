import { Message } from '@xmtp/xmtp-js'
import React, { MutableRefObject } from 'react'
import Emoji from 'react-emoji-render'
import Avatar from '../Avatar'
import { formatTime } from '../../helpers'
import AddressPill from '../AddressPill'

export type MessageListProps = {
  messages: Message[]
  walletAddress: string | undefined
  messagesEndRef: MutableRefObject<null>
}

type MessageTileProps = {
  message: Message
  isSender: boolean
}

const isOnSameDay = (d1?: Date, d2?: Date): boolean => {
  return d1?.toDateString() === d2?.toDateString()
}

const formatDate = (d?: Date) =>
  d?.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

const MessageTile = ({ message, isSender }: MessageTileProps): JSX.Element => (
  <div className="flex items-start mx-auto mb-4">
    <a
      href={`http://baidu.com/${message.senderAddress}`}
      target="_blank"
      rel="noreferrer"
    >
      <Avatar peerAddress={message.senderAddress as string} />
    </a>
    <div className="ml-2">
      <div>
        <AddressPill
          address={message.senderAddress as string}
          userIsSender={isSender}
        />
        <span className="text-sm font-normal uppercase place-self-end text-n-300 text-md">
          {formatTime(message.sent)}
        </span>
      </div>
      <span className="block px-2 mt-2 font-normal text-black text-md">
        {message.error ? (
          `Error: ${message.error?.message}`
        ) : (
          <Emoji text={message.content || ''} />
        )}
      </span>
    </div>
  </div>
)

const DateDividerBorder: React.FC = ({ children }) => (
  <>
    <div className="grow h-0.5 bg-gray-300/25" />
    {children}
    <div className="grow h-0.5 bg-gray-300/25" />
  </>
)

const DateDivider = ({ date }: { date?: Date }): JSX.Element => (
  <div className="flex items-center pt-4 pb-8 align-items-center">
    <DateDividerBorder>
      <span className="flex-none text-sm font-bold text-gray-300 mx-11">
        {formatDate(date)}
      </span>
    </DateDividerBorder>
  </div>
)

const ConversationBeginningNotice = (): JSX.Element => (
  <div className="flex justify-center pb-4 align-items-center">
    <span className="text-sm font-semibold text-gray-300">
      This is the beginning of the conversation
    </span>
  </div>
)

const MessagesList = ({
  messages,
  walletAddress,
  messagesEndRef,
}: MessageListProps): JSX.Element => {
  let lastMessageDate: Date | undefined

  return (
    <div className="flex flex-grow">
      <div className="flex flex-col self-end w-full pb-6 md:pb-0">
        <div className="relative flex w-full px-4 pt-6 overflow-y-auto bg-white">
          <div className="w-full">
            {messages && messages.length ? (
              <ConversationBeginningNotice />
            ) : null}
            {messages?.map((msg: Message) => {
              const isSender = msg.senderAddress === walletAddress
              const tile = (
                <MessageTile message={msg} key={msg.id} isSender={isSender} />
              )
              const dateHasChanged = !isOnSameDay(lastMessageDate, msg.sent)
              lastMessageDate = msg.sent
              return dateHasChanged
                ? [<DateDivider date={msg.sent} key={`date-${msg.id}`} />, tile]
                : tile
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </div>
  )
}
export default MessagesList
