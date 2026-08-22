"use client";

import { useState, useEffect } from "react";
import { 
  MapPin, 
  Calendar, 
  Plus, 
  CheckCircle2, 
  Clock,
  Loader2,
  X,
  AlertTriangle,
  Users,
  Edit3,
  Link as LinkIcon
} from "lucide-react";
import { 
  getAdminCampaignsData, 
  createAdminCampaign, 
  updateAdminCampaign,
  getCampaignDetails,
  type AdminCampaignCard,
  type CampaignVolunteerItem
} from "@/lib/actions/campaigns";
import { cn } from "@/lib/utils";

const PRESET_CAMPAIGN_IMAGES = [
  { label: "Community Blood Drive", url: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=800" },
  { label: "Volunteers Donating", url: "https://images.unsplash.com/photo-1536856136534-bb679c52a9aa?auto=format&fit=crop&q=80&w=800" },
  { label: "University Campus Outreach", url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800" },
  { label: "Hospital Emergency Rally", url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800" },
];

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<AdminCampaignCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Create Campaign Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    targetUnits: 150,
    imageUrl: PRESET_CAMPAIGN_IMAGES[0].url,
  });
  const [isCreateSubmitting, setIsCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState("");

  // Edit Campaign Modal State
  const [editingCampaign, setEditingCampaign] = useState<AdminCampaignCard | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    targetUnits: 150,
    imageUrl: "",
  });
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editError, setEditError] = useState("");

  // Details Modal State
  const [selectedDetails, setSelectedDetails] = useState<{
    campaign: AdminCampaignCard;
    volunteers: CampaignVolunteerItem[];
  } | null>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    const data = await getAdminCampaignsData();
    setCampaigns(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
    setCreateError("");
    if (!createForm.startDate) {
      const today = new Date().toISOString().split("T")[0];
      const weekLater = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      setCreateForm((prev) => ({ ...prev, startDate: today, endDate: weekLater }));
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.title || !createForm.location || !createForm.startDate || !createForm.endDate) {
      setCreateError("Please fill out campaign title, location, start date, and end date.");
      return;
    }

    setIsCreateSubmitting(true);
    setCreateError("");

    const res = await createAdminCampaign(createForm);
    setIsCreateSubmitting(false);

    if (res.success) {
      setIsCreateModalOpen(false);
      setCreateForm({
        title: "",
        description: "",
        location: "",
        startDate: "",
        endDate: "",
        targetUnits: 150,
        imageUrl: PRESET_CAMPAIGN_IMAGES[0].url,
      });
      loadData();
    } else {
      setCreateError(res.error || "Failed to create campaign.");
    }
  };

  const handleOpenEditModal = (camp: AdminCampaignCard) => {
    setEditingCampaign(camp);
    setEditError("");
    setEditForm({
      title: camp.title,
      description: camp.description || "",
      location: camp.location,
      startDate: camp.startDate,
      endDate: camp.endDate,
      targetUnits: camp.targetUnits,
      imageUrl: camp.imageUrl || PRESET_CAMPAIGN_IMAGES[0].url,
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCampaign) return;
    if (!editForm.title || !editForm.location || !editForm.startDate || !editForm.endDate) {
      setEditError("Please fill out campaign title, location, start date, and end date.");
      return;
    }

    setIsEditSubmitting(true);
    setEditError("");

    const res = await updateAdminCampaign(editingCampaign.id, editForm);
    setIsEditSubmitting(false);

    if (res.success) {
      setEditingCampaign(null);
      loadData();
    } else {
      setEditError(res.error || "Failed to update campaign.");
    }
  };

  const handleOpenDetails = async (campaignId: string) => {
    setIsDetailsLoading(true);
    const details = await getCampaignDetails(campaignId);
    setSelectedDetails(details);
    setIsDetailsLoading(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">Blood Donation Campaigns</h1>
          <p className="text-muted-foreground font-medium">Organize blood drives, track volunteer registrations, and measure campaign impact.</p>
        </div>
        <button 
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create New Campaign
        </button>
      </div>

      {/* Campaign Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-6 h-64 animate-pulse flex flex-col justify-between">
              <div className="h-4 bg-secondary rounded w-1/3 mb-4" />
              <div className="h-6 bg-secondary rounded w-3/4 mb-2" />
              <div className="h-4 bg-secondary rounded w-1/2 mb-6" />
              <div className="h-3 bg-secondary rounded w-full" />
            </div>
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="bg-card border border-border p-12 rounded-2xl text-center space-y-3">
          <p className="text-foreground font-bold text-lg">No blood donation campaigns found.</p>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Click the "Create New Campaign" button above to launch an active blood drive or outreach event.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {campaigns.map((camp) => (
            <div key={camp.id} className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
              <div>
                {/* Banner Image */}
                {camp.imageUrl && (
                  <div className="h-36 -mx-6 -mt-6 mb-4 overflow-hidden relative group">
                    <img 
                      src={camp.imageUrl} 
                      alt={camp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                  </div>
                )}

                <div className="flex justify-between items-start mb-4">
                  <span className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold",
                    camp.status === "Active" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                    camp.status === "Upcoming" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" :
                    "bg-secondary text-muted-foreground"
                  )}>
                    {camp.status === "Active" ? <Clock className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    {camp.status}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-muted-foreground">Target: {camp.targetUnits} Units</span>
                    <button 
                      onClick={() => handleOpenEditModal(camp)}
                      className="p-1 text-muted-foreground hover:text-primary transition-colors"
                      title="Edit Campaign"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-foreground mb-2">{camp.title}</h3>

                <div className="space-y-1.5 text-xs text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{camp.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{camp.startDate} to {camp.endDate}</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="space-y-1.5 pt-4 border-t border-border">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-foreground">{camp.registeredDonors} Registered Volunteers</span>
                    <span className="text-primary font-bold">{camp.progress}% Goal</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${camp.progress}%` }} />
                  </div>
                </div>

                <div className="mt-4 pt-3 flex justify-between items-center">
                  <button 
                    onClick={() => handleOpenEditModal(camp)}
                    className="text-xs font-bold text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button 
                    onClick={() => handleOpenDetails(camp.id)}
                    className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Manage Registrations & Details →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create New Campaign Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl w-full max-w-lg space-y-5 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="text-xl font-bold text-foreground">Create New Campaign</h3>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createError && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{createError}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Campaign Title</label>
                <input 
                  type="text"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  placeholder="e.g. Shambu Community Outreach Blood Drive"
                  className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Campaign Image URL & Presets */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center justify-between">
                  <span>Campaign Picture / Banner URL</span>
                </label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input 
                    type="url"
                    value={createForm.imageUrl}
                    onChange={(e) => setCreateForm({ ...createForm, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                {/* Presets */}
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {PRESET_CAMPAIGN_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCreateForm({ ...createForm, imageUrl: preset.url })}
                      className={cn(
                        "relative rounded-lg overflow-hidden border-2 h-14 transition-all group",
                        createForm.imageUrl === preset.url ? "border-primary ring-2 ring-primary/20" : "border-border opacity-70 hover:opacity-100"
                      )}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <input 
                  type="text"
                  value={createForm.location}
                  onChange={(e) => setCreateForm({ ...createForm, location: e.target.value })}
                  placeholder="e.g. Shambu Town Hall Assembly Center"
                  className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <input 
                    type="date"
                    value={createForm.startDate}
                    onChange={(e) => setCreateForm({ ...createForm, startDate: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <input 
                    type="date"
                    value={createForm.endDate}
                    onChange={(e) => setCreateForm({ ...createForm, endDate: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Target Units</label>
                <input 
                  type="number"
                  min="1"
                  value={createForm.targetUnits}
                  onChange={(e) => setCreateForm({ ...createForm, targetUnits: parseInt(e.target.value, 10) || 100 })}
                  className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm font-bold outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description (Optional)</label>
                <input 
                  type="text"
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  placeholder="e.g. Annual blood drive campaign for community hospitals"
                  className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-input text-sm font-semibold hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreateSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {isCreateSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Campaign Modal */}
      {editingCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl w-full max-w-lg space-y-5 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="text-xl font-bold text-foreground">Edit Campaign</h3>
              <button 
                onClick={() => setEditingCampaign(null)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Campaign Title</label>
                <input 
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Campaign Image URL & Presets */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center justify-between">
                  <span>Campaign Picture / Banner URL</span>
                </label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input 
                    type="url"
                    value={editForm.imageUrl}
                    onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                {/* Presets */}
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {PRESET_CAMPAIGN_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setEditForm({ ...editForm, imageUrl: preset.url })}
                      className={cn(
                        "relative rounded-lg overflow-hidden border-2 h-14 transition-all group",
                        editForm.imageUrl === preset.url ? "border-primary ring-2 ring-primary/20" : "border-border opacity-70 hover:opacity-100"
                      )}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <input 
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <input 
                    type="date"
                    value={editForm.startDate}
                    onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <input 
                    type="date"
                    value={editForm.endDate}
                    onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Target Units</label>
                <input 
                  type="number"
                  min="1"
                  value={editForm.targetUnits}
                  onChange={(e) => setEditForm({ ...editForm, targetUnits: parseInt(e.target.value, 10) || 100 })}
                  className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm font-bold outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description (Optional)</label>
                <input 
                  type="text"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditingCampaign(null)}
                  className="px-4 py-2.5 rounded-xl border border-input text-sm font-semibold hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {isEditSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Update Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details & Registrations Modal */}
      {selectedDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl w-full max-w-xl space-y-6 relative">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-xl font-bold text-foreground">{selectedDetails.campaign.title}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-primary" /> {selectedDetails.campaign.location}
                </p>
              </div>
              <button 
                onClick={() => setSelectedDetails(null)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Campaign Summary Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-secondary/30 p-4 rounded-xl text-xs">
              <div>
                <span className="text-muted-foreground block">Status</span>
                <span className={cn(
                  "font-bold",
                  selectedDetails.campaign.status === "Active" ? "text-emerald-600 dark:text-emerald-400" :
                  selectedDetails.campaign.status === "Upcoming" ? "text-blue-600 dark:text-blue-400" :
                  "text-muted-foreground"
                )}>{selectedDetails.campaign.status}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Campaign Schedule</span>
                <span className="font-semibold text-foreground">{selectedDetails.campaign.startDate} to {selectedDetails.campaign.endDate}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Target Goal</span>
                <span className="font-bold text-foreground text-sm">{selectedDetails.campaign.targetUnits} Units</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Registered Volunteers</span>
                <span className="font-bold text-primary text-sm">{selectedDetails.campaign.registeredDonors} Donors</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Goal Progress</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{selectedDetails.campaign.progress}% Goal</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Collected Units</span>
                <span className="font-semibold text-foreground">{selectedDetails.campaign.collectedUnits} Units</span>
              </div>
            </div>

            {/* Registered Volunteers List */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" /> Registered Volunteers ({selectedDetails.volunteers.length})
              </h4>
              {selectedDetails.volunteers.length === 0 ? (
                <p className="text-xs text-muted-foreground italic bg-secondary/20 p-4 rounded-xl text-center">
                  No volunteer registrations recorded for this campaign yet.
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedDetails.volunteers.map((v) => (
                    <div key={v.id} className="p-3 rounded-xl border border-border bg-card flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-foreground block">{v.name}</span>
                        <span className="text-muted-foreground">{v.email} • {v.phone}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-primary block">{v.bloodGroup}</span>
                        <span className="text-muted-foreground text-[10px]">Registered: {v.registeredAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end border-t border-border">
              <button
                onClick={() => setSelectedDetails(null)}
                className="px-5 py-2 rounded-xl bg-secondary text-foreground text-xs font-semibold hover:bg-secondary/80 transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
