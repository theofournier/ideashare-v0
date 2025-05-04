"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MoreHorizontal, Eye, CheckCircle, XCircle } from "lucide-react"
import { reports, type Report } from "@/lib/admin-data"
import { getUserById, getIdeaById } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

export default function ReportsManagement() {
  const [allReports, setAllReports] = useState<Report[]>(reports)
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "reviewed" | "dismissed">("all")
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"approve" | "reject">("approve")

  const router = useRouter()
  const { toast } = useToast()

  // Filter reports by status
  const filteredReports = allReports.filter((report) => {
    return statusFilter === "all" || report.status === statusFilter
  })

  // Count reports by status
  const pendingCount = allReports.filter((report) => report.status === "pending").length
  const reviewedCount = allReports.filter((report) => report.status === "reviewed").length
  const dismissedCount = allReports.filter((report) => report.status === "dismissed").length

  const handleApproveReport = () => {
    if (!selectedReport) return

    // Update report status
    setAllReports(
      allReports.map((report) => (report.id === selectedReport.id ? { ...report, status: "reviewed" } : report)),
    )

    toast({
      title: "Report approved",
      description: "The report has been marked as reviewed.",
    })

    setIsActionDialogOpen(false)
  }

  const handleDismissReport = () => {
    if (!selectedReport) return

    // Update report status
    setAllReports(
      allReports.map((report) => (report.id === selectedReport.id ? { ...report, status: "dismissed" } : report)),
    )

    toast({
      title: "Report dismissed",
      description: "The report has been dismissed.",
    })

    setIsActionDialogOpen(false)
  }

  const getStatusBadge = (status: Report["status"]) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      case "reviewed":
        return <Badge className="bg-green-500">Reviewed</Badge>
      case "dismissed":
        return <Badge variant="outline">Dismissed</Badge>
    }
  }

  const getReasonBadge = (reason: Report["reason"]) => {
    switch (reason) {
      case "inappropriate":
        return <Badge variant="outline">Inappropriate</Badge>
      case "spam":
        return <Badge variant="outline">Spam</Badge>
      case "offensive":
        return <Badge className="bg-red-500">Offensive</Badge>
      case "copyright":
        return <Badge variant="outline">Copyright</Badge>
      case "misinformation":
        return <Badge className="bg-yellow-500">Misinformation</Badge>
      case "other":
        return <Badge variant="outline">Other</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reports Management</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Reports awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Reviewed Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviewedCount}</div>
            <p className="text-xs text-muted-foreground">Reports that have been reviewed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Dismissed Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dismissedCount}</div>
            <p className="text-xs text-muted-foreground">Reports that have been dismissed</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reports</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="dismissed">Dismissed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Idea</TableHead>
              <TableHead>Reported By</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.map((report) => {
              const idea = getIdeaById(report.ideaId)
              const user = getUserById(report.userId)

              return (
                <TableRow key={report.id}>
                  <TableCell className="font-mono text-xs">{report.id}</TableCell>
                  <TableCell className="font-medium">{idea?.title || "Unknown Idea"}</TableCell>
                  <TableCell>{user?.name || "Unknown User"}</TableCell>
                  <TableCell>{getReasonBadge(report.reason)}</TableCell>
                  <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedReport(report)
                            setIsViewDialogOpen(true)
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {report.status === "pending" && (
                          <>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedReport(report)
                                setActionType("approve")
                                setIsActionDialogOpen(true)
                              }}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve Report
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedReport(report)
                                setActionType("reject")
                                setIsActionDialogOpen(true)
                              }}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Dismiss Report
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem onClick={() => router.push(`/idea/${report.ideaId}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Idea
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}

            {filteredReports.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No reports found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Report Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Report ID</h3>
                  <p className="font-mono text-xs">{selectedReport.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <div className="mt-1">{getStatusBadge(selectedReport.status)}</div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Reported Idea</h3>
                  <p>{getIdeaById(selectedReport.ideaId)?.title || "Unknown Idea"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Reported By</h3>
                  <p>{getUserById(selectedReport.userId)?.name || "Unknown User"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Date Reported</h3>
                  <p>{new Date(selectedReport.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Reason</h3>
                  <div className="mt-1">{getReasonBadge(selectedReport.reason)}</div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p className="mt-1 whitespace-pre-wrap rounded-md bg-muted p-3 text-sm">
                  {selectedReport.description || "No additional details provided."}
                </p>
              </div>

              {selectedReport.status === "pending" && (
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsViewDialogOpen(false)
                      setActionType("reject")
                      setIsActionDialogOpen(true)
                    }}
                  >
                    Dismiss Report
                  </Button>
                  <Button
                    onClick={() => {
                      setIsViewDialogOpen(false)
                      setActionType("approve")
                      setIsActionDialogOpen(true)
                    }}
                  >
                    Approve Report
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Action Dialog */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{actionType === "approve" ? "Approve Report" : "Dismiss Report"}</DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? "Are you sure you want to approve this report? This will mark the report as reviewed."
                : "Are you sure you want to dismiss this report? This indicates the report doesn't require action."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={actionType === "approve" ? "default" : "secondary"}
              onClick={actionType === "approve" ? handleApproveReport : handleDismissReport}
            >
              {actionType === "approve" ? "Approve" : "Dismiss"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
