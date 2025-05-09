"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteIdeaDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  ideaTitle: string
}

export function DeleteIdeaDialog({ isOpen, onClose, onConfirm, ideaTitle }: DeleteIdeaDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Idea</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{ideaTitle}&quot;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
