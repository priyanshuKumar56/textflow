"use client"

import * as React from "react"
import { X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"
import { Command as CommandPrimitive } from "cmdk"

type TagInputProps = {
  placeholder?: string
  tags: string[]
  onTagsChange: (tags: string[]) => void
  maxTags?: number
  disabled?: boolean
  suggestions?: string[]
}

export function TagInput({
  placeholder = "Add tag...",
  tags,
  onTagsChange,
  maxTags = 10,
  disabled = false,
  suggestions = [],
}: TagInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [inputValue, setInputValue] = React.useState("")
  const [open, setOpen] = React.useState(false)

  const handleUnselect = React.useCallback(
    (tag: string) => {
      onTagsChange(tags.filter((t) => t !== tag))
    },
    [tags, onTagsChange],
  )

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const input = inputRef.current
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "" && tags.length > 0) {
            handleUnselect(tags[tags.length - 1])
          }
        }
        // This is not a default behavior of the <input /> field
        if (e.key === "Escape") {
          input.blur()
        }
      }
    },
    [tags, handleUnselect],
  )

  const handleAddTag = React.useCallback(
    (tag: string) => {
      if (tag && !tags.includes(tag) && tags.length < maxTags) {
        onTagsChange([...tags, tag])
        setInputValue("")
      }
    },
    [tags, onTagsChange, maxTags],
  )

  const handleInputKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && inputValue) {
        e.preventDefault()
        handleAddTag(inputValue.trim())
      }
    },
    [inputValue, handleAddTag],
  )

  return (
    <Command className="overflow-visible bg-transparent">
      <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="rounded-sm">
              {tag}
              {!disabled && (
                <button
                  type="button"
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={() => handleUnselect(tag)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </Badge>
          ))}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onKeyDown={handleInputKeyDown}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={tags.length < maxTags ? placeholder : ""}
            disabled={disabled}
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      {open && suggestions.length > 0 && (
        <div className="relative mt-2">
          <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto">
              {suggestions.map((suggestion) => (
                <CommandItem
                  key={suggestion}
                  onSelect={() => {
                    handleAddTag(suggestion)
                    setOpen(false)
                  }}
                >
                  {suggestion}
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        </div>
      )}
    </Command>
  )
}
