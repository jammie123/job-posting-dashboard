import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { cs } from "date-fns/locale"

// Update the PositionNoteProps interface to make text optional and add a hasNote property
interface PositionNoteProps {
  recruiterName: string
  createdAt?: Date
  text?: string
  maxLength?: number
  hasNote?: boolean
}

// Update the component to handle both note display and "add note" button
export function PositionNote({ recruiterName, createdAt, text, maxLength = 200, hasNote = false }: PositionNoteProps) {
  // Get initials from recruiter name
  const initials = recruiterName
    .split(" ")
    .map((part) => part[0])
    .join("")

  // If there's no note, render nothing (hide add note button)
  if (!hasNote) return null

  // Format the date to show how long ago it was created
  const formattedDate = createdAt ? formatDistanceToNow(createdAt, { addSuffix: true, locale: cs }) : ""

  // Truncate text if it exceeds maxLength
  const truncatedText = text && text.length > maxLength ? `${text.substring(0, maxLength)}...` : text

  return (
    <div className="flex gap-3 pt-[16px] top-[80px] left-[52px] ml-4">
    <div className="flex min-w-0  bg-gray-100/80 p-1 rounded-md ">
        <div className="flex gap-1 justify-start items-center">
        <Avatar className="h-6 w-6">
                                              <AvatarFallback className="text-xs font-medium uppercase">
                                                <div className="aspect-square h-full w-full flex items-center justify-center">
                                                  {recruiterName
                                                    .split(" ")
                                                    .map((part) => part[0])
                                                    .join("")}
                                                </div>
                                              </AvatarFallback>
                                            </Avatar>
          <p className="text-sm text-muted-foreground line-clamp-1 ">
            {truncatedText} <span className="text-xs text-muted-foreground">{formattedDate}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

