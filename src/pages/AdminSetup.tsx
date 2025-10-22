import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Shield } from 'lucide-react';

export default function AdminSetup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(user?.id || '');
  const [isCreating, setIsCreating] = useState(false);

  async function handleCreateAdmin() {
    if (!userId) {
      toast.error('Please enter a user ID');
      return;
    }

    setIsCreating(true);

    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: 'admin',
        });

      if (error) {
        if (error.code === '23505') {
          toast.error('This user already has a role assigned');
        } else {
          throw error;
        }
      } else {
        toast.success('Admin user created successfully!');
        navigate('/admin');
      }
    } catch (error: any) {
      console.error('Error creating admin:', error);
      toast.error('Failed to create admin user');
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 bg-maroon rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl">Create First Admin</CardTitle>
          <CardDescription>
            Set up the initial administrator account for your Lost & Found platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">User ID</label>
            <Input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter user UUID"
              disabled={isCreating}
            />
            <p className="text-xs text-gray-500 mt-2">
              {user ? 'Your current user ID is pre-filled above' : 'Login first to auto-fill your user ID'}
            </p>
          </div>

          <Button 
            onClick={handleCreateAdmin}
            disabled={isCreating || !userId}
            className="w-full"
          >
            {isCreating ? 'Creating...' : 'Create Admin User'}
          </Button>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
            <h4 className="font-semibold text-blue-900 mb-2">Need Help?</h4>
            <p className="text-blue-800 mb-2">
              To find a user ID, check your Supabase dashboard under Authentication → Users.
            </p>
            <a
              href="https://supabase.com/dashboard/project/lfhcwsyqdfyheofnflqe/auth/users"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Open Supabase Users →
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
