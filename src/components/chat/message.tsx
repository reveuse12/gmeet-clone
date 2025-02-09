import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

interface MessageProps {
  message: {
    id: string
    content: string
    sender: {
      name: string
      avatar?: string
      email?: string
    }
    timestamp: Date
    type?: "user" | "system"
  }
  isCurrentUser?: boolean
}

export function Message({ message, isCurrentUser }: MessageProps) {
  return (
    <div className={cn("flex gap-3 w-full", isCurrentUser && "flex-row-reverse")}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
        <AvatarFallback>{message.sender.name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className={cn("flex flex-col gap-1", isCurrentUser && "items-end")}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{isCurrentUser ? "You" : message.sender.name}</span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(message.timestamp, { addSuffix: true })}
          </span>
        </div>
        <div
          className={cn(
            "rounded-lg px-3 py-2 max-w-[85%] break-words",
            message.type === "system"
              ? "bg-muted text-muted-foreground"
              : isCurrentUser
                ? "bg-primary text-primary-foreground"
                : "bg-muted",
          )}
        >
          {message.content}
        </div>
      </div>
    </div>
  )
}

