import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Deal, InsertDeal, Product } from "@shared/schema";
import { Percent, Plus, Edit, Trash2, Calendar, Tag, TrendingUp } from "lucide-react";

export default function DealsManagement() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [newDeal, setNewDeal] = useState<InsertDeal>({
    title: "",
    description: "",
    discountType: "percentage",
    discountValue: 0,
    startDate: "",
    endDate: "",
    isActive: true,
    minOrderAmount: 0,
    maxUses: null,
    currentUses: 0
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: deals, isLoading } = useQuery<Deal[]>({
    queryKey: ["/api/deals"],
    queryFn: async () => {
      const response = await fetch("/api/deals");
      if (!response.ok) throw new Error("Failed to fetch deals");
      return response.json();
    },
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const createDealMutation = useMutation({
    mutationFn: async (dealData: InsertDeal) => {
      await apiRequest("POST", "/api/deals", dealData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deals"] });
      setIsCreateModalOpen(false);
      resetNewDeal();
      toast({
        title: "Deal created successfully",
        description: "The new deal has been added and is now active.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to create deal",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const updateDealMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertDeal> }) => {
      await apiRequest("PUT", `/api/deals/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deals"] });
      setEditingDeal(null);
      toast({
        title: "Deal updated successfully",
        description: "The deal has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to update deal",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const deleteDealMutation = useMutation({
    mutationFn: async (dealId: string) => {
      await apiRequest("DELETE", `/api/deals/${dealId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deals"] });
      toast({
        title: "Deal deleted successfully",
        description: "The deal has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to delete deal",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const resetNewDeal = () => {
    setNewDeal({
      title: "",
      description: "",
      discountType: "percentage",
      discountValue: 0,
      startDate: "",
      endDate: "",
      isActive: true,
      minOrderAmount: 0,
      maxUses: null,
      currentUses: 0
    });
  };

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    createDealMutation.mutate(newDeal);
  };

  const handleUpdateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDeal) return;
    
    const formData = new FormData(e.target as HTMLFormElement);
    const updatedData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      discountType: formData.get("discountType") as "percentage" | "fixed",
      discountValue: parseFloat(formData.get("discountValue") as string),
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      isActive: formData.get("isActive") === "true",
      minOrderAmount: parseFloat(formData.get("minOrderAmount") as string) || 0,
      maxUses: formData.get("maxUses") ? parseInt(formData.get("maxUses") as string) : null,
    };
    
    updateDealMutation.mutate({ id: editingDeal._id!, data: updatedData });
  };

  const getStatusVariant = (deal: Deal) => {
    const now = new Date();
    const startDate = new Date(deal.startDate);
    const endDate = new Date(deal.endDate);
    
    if (!deal.isActive) return "secondary";
    if (now < startDate) return "outline";
    if (now > endDate) return "destructive";
    if (deal.maxUses && deal.currentUses >= deal.maxUses) return "secondary";
    return "default";
  };

  const getStatusText = (deal: Deal) => {
    const now = new Date();
    const startDate = new Date(deal.startDate);
    const endDate = new Date(deal.endDate);
    
    if (!deal.isActive) return "Inactive";
    if (now < startDate) return "Scheduled";
    if (now > endDate) return "Expired";
    if (deal.maxUses && deal.currentUses >= deal.maxUses) return "Used Up";
    return "Active";
  };

  const formatDiscount = (deal: Deal) => {
    return deal.discountType === "percentage" 
      ? `${deal.discountValue}% off`
      : `$${deal.discountValue} off`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Deals Management
          </CardTitle>
          <CardDescription>Loading deals data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-slate-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Deals Management
            </CardTitle>
            <CardDescription>Create and manage promotional deals and discounts</CardDescription>
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Deal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Deal</DialogTitle>
                <DialogDescription>
                  Set up a new promotional deal or discount for your customers.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateDeal} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Deal Title</Label>
                  <Input
                    id="title"
                    value={newDeal.title}
                    onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
                    placeholder="e.g., Black Friday Sale"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newDeal.description}
                    onChange={(e) => setNewDeal({ ...newDeal, description: e.target.value })}
                    placeholder="Describe your deal..."
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="discountType">Discount Type</Label>
                    <Select 
                      value={newDeal.discountType} 
                      onValueChange={(value: "percentage" | "fixed") => setNewDeal({ ...newDeal, discountType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discountValue">
                      {newDeal.discountType === "percentage" ? "Percentage (%)" : "Amount ($)"}
                    </Label>
                    <Input
                      id="discountValue"
                      type="number"
                      min="0"
                      step={newDeal.discountType === "percentage" ? "1" : "0.01"}
                      value={newDeal.discountValue}
                      onChange={(e) => setNewDeal({ ...newDeal, discountValue: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      value={newDeal.startDate}
                      onChange={(e) => setNewDeal({ ...newDeal, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      value={newDeal.endDate}
                      onChange={(e) => setNewDeal({ ...newDeal, endDate: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minOrderAmount">Minimum Order Amount ($)</Label>
                    <Input
                      id="minOrderAmount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={newDeal.minOrderAmount}
                      onChange={(e) => setNewDeal({ ...newDeal, minOrderAmount: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxUses">Maximum Uses (optional)</Label>
                    <Input
                      id="maxUses"
                      type="number"
                      min="1"
                      value={newDeal.maxUses || ""}
                      onChange={(e) => setNewDeal({ ...newDeal, maxUses: e.target.value ? parseInt(e.target.value) : null })}
                      placeholder="Unlimited"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createDealMutation.isPending}>
                    {createDealMutation.isPending ? "Creating..." : "Create Deal"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {/* Deals Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Deals</p>
                  <p className="text-2xl font-bold">{deals?.filter(d => getStatusText(d) === "Active").length || 0}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Scheduled Deals</p>
                  <p className="text-2xl font-bold">{deals?.filter(d => getStatusText(d) === "Scheduled").length || 0}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Deals</p>
                  <p className="text-2xl font-bold">{deals?.length || 0}</p>
                </div>
                <Percent className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Deals Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Deal</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deals?.map((deal) => (
                <TableRow key={deal._id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{deal.title}</p>
                      <p className="text-sm text-muted-foreground">{deal.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Percent className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{formatDiscount(deal)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{new Date(deal.startDate).toLocaleDateString()}</p>
                      <p className="text-muted-foreground">to {new Date(deal.endDate).toLocaleDateString()}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{deal.currentUses} uses</p>
                      {deal.maxUses && (
                        <p className="text-muted-foreground">of {deal.maxUses} max</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(deal)}>
                      {getStatusText(deal)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingDeal(deal)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteDealMutation.mutate(deal._id!)}
                        disabled={deleteDealMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Edit Deal Dialog */}
        <Dialog open={!!editingDeal} onOpenChange={() => setEditingDeal(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Deal</DialogTitle>
              <DialogDescription>
                Update the deal information and settings.
              </DialogDescription>
            </DialogHeader>
            {editingDeal && (
              <form onSubmit={handleUpdateDeal} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Deal Title</Label>
                  <Input
                    id="edit-title"
                    name="title"
                    defaultValue={editingDeal.title}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    defaultValue={editingDeal.description}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-discountType">Discount Type</Label>
                    <Select name="discountType" defaultValue={editingDeal.discountType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-discountValue">Discount Value</Label>
                    <Input
                      id="edit-discountValue"
                      name="discountValue"
                      type="number"
                      min="0"
                      step="0.01"
                      defaultValue={editingDeal.discountValue}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-startDate">Start Date</Label>
                    <Input
                      id="edit-startDate"
                      name="startDate"
                      type="datetime-local"
                      defaultValue={editingDeal.startDate}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-endDate">End Date</Label>
                    <Input
                      id="edit-endDate"
                      name="endDate"
                      type="datetime-local"
                      defaultValue={editingDeal.endDate}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-isActive">Status</Label>
                  <Select name="isActive" defaultValue={editingDeal.isActive.toString()}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingDeal(null)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateDealMutation.isPending}>
                    {updateDealMutation.isPending ? "Updating..." : "Update Deal"}
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}