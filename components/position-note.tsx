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

  // If there's no note, show the "add note" button
  if (!hasNote) {
    return (
      <div className="flex gap-3 p-3 bg-gray-50 rounded-md border border-dashed border-gray-200 items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
        <button className="text-sm text-muted-foreground flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-plus-circle"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v8" />
            <path d="M8 12h8" />
          </svg>
          Přidat poznámku
        </button>
      </div>
    )
  }

  // Format the date to show how long ago it was created
  const formattedDate = createdAt ? formatDistanceToNow(createdAt, { addSuffix: true, locale: cs }) : ""

  // Truncate text if it exceeds maxLength
  const truncatedText = text && text.length > maxLength ? `${text.substring(0, maxLength)}...` : text

  return (
    <div className="flex gap-3 p-3 bg-gray-50 rounded-md">
      <div className="flex-1 min-w-0">
        <div className="flex gap-1 justify-between items-center mb-1">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs font-medium uppercase bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {truncatedText} <span className="text-xs text-muted-foreground">{formattedDate}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

