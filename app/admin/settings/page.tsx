"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

export default function AdminSettings() {
  const [siteName, setSiteName] = useState("IdeaShare")
  const [siteDescription, setSiteDescription] = useState("Share and discover tech project ideas")
  const [requireApproval, setRequireApproval] = useState(false)
  const [allowComments, setAllowComments] = useState(true)
  const [maxIdeasPerUser, setMaxIdeasPerUser] = useState(10)

  const { toast } = useToast()

  const handleSave = () => {
    // In a real app, we would save these settings to a database
    toast({
      title: "Settings saved",
      description: "Your changes have been saved successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Configure the general settings for your platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site-name">Site Name</Label>
            <Input id="site-name" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="site-description">Site Description</Label>
            <Input id="site-description" value={siteDescription} onChange={(e) => setSiteDescription(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content Settings</CardTitle>
          <CardDescription>Configure how content is managed on your platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="require-approval">Require Approval for New Ideas</Label>
              <p className="text-sm text-muted-foreground">
                When enabled, new ideas will require admin approval before being published
              </p>
            </div>
            <Switch id="require-approval" checked={requireApproval} onCheckedChange={setRequireApproval} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allow-comments">Allow Comments</Label>
              <p className="text-sm text-muted-foreground">When enabled, users can comment on ideas</p>
            </div>
            <Switch id="allow-comments" checked={allowComments} onCheckedChange={setAllowComments} />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="max-ideas">Maximum Ideas per User</Label>
            <Input
              id="max-ideas"
              type="number"
              min="1"
              max="100"
              value={maxIdeasPerUser}
              onChange={(e) => setMaxIdeasPerUser(Number.parseInt(e.target.value))}
            />
            <p className="text-sm text-muted-foreground">
              Set the maximum number of ideas a user can submit (0 for unlimited)
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
