import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Claim {
  id: string;
  item_id: string;
  item_type: 'lost' | 'found';
  claimant_id: string;
  evidence_urls: string[];
  explanation: string;
  status: string;
  created_at: string;
  item_name?: string;
}

export default function ClaimsManagement() {
  const { user } = useAuth();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    loadClaims();
  }, []);

  async function loadClaims() {
    try {
      const { data: claimsData, error } = await supabase
        .from('claims')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch item names
      const claimsWithNames = await Promise.all(
        (claimsData || []).map(async (claim) => {
          const table = claim.item_type === 'lost' ? 'lost_objects' : 'found_objects';
          const { data: itemData } = await supabase
            .from(table)
            .select('object_name')
            .eq('id', claim.item_id)
            .single();

          return {
            ...claim,
            item_type: claim.item_type as 'lost' | 'found',
            item_name: itemData?.object_name || 'Unknown Item',
          };
        })
      );

      setClaims(claimsWithNames as Claim[]);
    } catch (error) {
      console.error('Error loading claims:', error);
      toast.error('Failed to load claims');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleApproveClaim(claim: Claim) {
    if (!user) return;

    try {
      // Update claim status
      const { error: claimError } = await supabase
        .from('claims')
        .update({
          status: 'approved',
          admin_id: user.id,
          admin_note: adminNotes[claim.id] || null,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', claim.id);

      if (claimError) throw claimError;

      // Mark item as claimed/resolved
      const table = claim.item_type === 'lost' ? 'lost_objects' : 'found_objects';
      const { error: itemError } = await supabase
        .from(table)
        .update({ status: 'claimed' })
        .eq('id', claim.item_id);

      if (itemError) throw itemError;

      // Create notification for claimant
      await supabase.from('notifications').insert({
        user_id: claim.claimant_id,
        title: 'Claim Approved',
        message: `Your claim for "${claim.item_name}" has been approved!`,
        type: 'claim_approved',
        related_id: claim.id,
      });

      // Log activity
      await supabase.from('activity_logs').insert({
        admin_id: user.id,
        action: 'approved_claim',
        entity_type: 'claim',
        entity_id: claim.id,
        details: { item_name: claim.item_name, claimant_id: claim.claimant_id },
      });

      toast.success('Claim approved successfully');
      loadClaims();
    } catch (error) {
      console.error('Error approving claim:', error);
      toast.error('Failed to approve claim');
    }
  }

  async function handleRejectClaim(claim: Claim) {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('claims')
        .update({
          status: 'rejected',
          admin_id: user.id,
          admin_note: adminNotes[claim.id] || 'Insufficient evidence',
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', claim.id);

      if (error) throw error;

      // Create notification for claimant
      await supabase.from('notifications').insert({
        user_id: claim.claimant_id,
        title: 'Claim Rejected',
        message: `Your claim for "${claim.item_name}" was rejected. ${adminNotes[claim.id] || 'Please provide more evidence.'}`,
        type: 'claim_rejected',
        related_id: claim.id,
      });

      // Log activity
      await supabase.from('activity_logs').insert({
        admin_id: user.id,
        action: 'rejected_claim',
        entity_type: 'claim',
        entity_id: claim.id,
        details: { item_name: claim.item_name, reason: adminNotes[claim.id] },
      });

      toast.success('Claim rejected');
      loadClaims();
    } catch (error) {
      console.error('Error rejecting claim:', error);
      toast.error('Failed to reject claim');
    }
  }

  const pendingClaims = claims.filter(c => c.status === 'pending');
  const reviewedClaims = claims.filter(c => c.status !== 'pending');

  const ClaimCard = ({ claim }: { claim: Claim }) => (
    <Card key={claim.id}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{claim.item_name}</CardTitle>
            <div className="flex gap-2 mt-2">
              <Badge variant={claim.item_type === 'lost' ? 'destructive' : 'default'}>
                {claim.item_type.toUpperCase()}
              </Badge>
              <Badge variant={
                claim.status === 'approved' ? 'default' :
                claim.status === 'rejected' ? 'destructive' : 'secondary'
              }>
                {claim.status.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm mb-2">Claimant's Explanation:</h4>
          <p className="text-sm text-gray-700">{claim.explanation}</p>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-2">Evidence Files:</h4>
          <div className="grid grid-cols-2 gap-2">
            {claim.evidence_urls.map((url, index) => (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50"
              >
                {url.toLowerCase().includes('.pdf') ? (
                  <span className="text-xs">PDF</span>
                ) : (
                  <img src={url} alt="Evidence" className="h-16 w-16 object-cover rounded" />
                )}
                <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-500">
          Submitted: {new Date(claim.created_at).toLocaleString()}
        </p>

        {claim.status === 'pending' && (
          <>
            <div>
              <label className="text-sm font-medium">Admin Note</label>
              <Textarea
                value={adminNotes[claim.id] || ''}
                onChange={(e) => setAdminNotes(prev => ({ ...prev, [claim.id]: e.target.value }))}
                placeholder="Add a note about this decision..."
                className="mt-1"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => handleApproveClaim(claim)}
                className="flex-1"
                variant="default"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Claim
              </Button>
              <Button
                onClick={() => handleRejectClaim(claim)}
                className="flex-1"
                variant="destructive"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject Claim
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maroon"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Claims Management</h2>
          <p className="text-muted-foreground">Review and process ownership claims</p>
        </div>

        {claims.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No claims submitted yet</p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList>
              <TabsTrigger value="pending">Pending ({pendingClaims.length})</TabsTrigger>
              <TabsTrigger value="reviewed">Reviewed ({reviewedClaims.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {pendingClaims.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-gray-500">No pending claims</p>
                  </CardContent>
                </Card>
              ) : (
                pendingClaims.map(claim => <ClaimCard key={claim.id} claim={claim} />)
              )}
            </TabsContent>

            <TabsContent value="reviewed" className="space-y-4">
              {reviewedClaims.map(claim => <ClaimCard key={claim.id} claim={claim} />)}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AdminLayout>
  );
}
