"use client"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Smile } from "lucide-react"
import Picker from "@emoji-mart/react"
import { useTheme } from "next-themes"
import data from "@emoji-mart/data"


interface EmojiPickerProps {
  onChange: (emoji: string) => void
}

export function EmojiPicker({ onChange }: EmojiPickerProps) {
  const { theme } = useTheme()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Smile className="h-5 w-5" />
          <span className="sr-only">Pick emoji</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" className="w-full border-none bg-transparent shadow-none">
        <Picker theme={theme} data={data} onEmojiSelect={(emoji: any) => onChange(emoji.native)} />
      </PopoverContent>
    </Popover>
  )
}

