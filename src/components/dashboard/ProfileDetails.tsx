
import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Edit3, Save, X, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface ProfileDetailsProps {
  user: User;
}

const ProfileDetails = ({ user }: ProfileDetailsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user.user_metadata?.full_name || '');
  const [website, setWebsite] = useState(user.user_metadata?.website || '');

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    // Reset the state to the original values
    setFullName(user.user_metadata?.full_name || '');
    setWebsite(user.user_metadata?.website || '');
  };

  const handleSaveClick = async () => {
    // Here you would implement the logic to save the updated profile details
    // to your backend or database.
    // For this example, we'll just simulate a successful save.
    setIsEditing(false);
    // You might want to refresh the user data after a successful save.
    console.log('Profile saved:', { fullName, website });
  };

  return (
    <div className="glass-effect rounded-2xl p-8 border border-webdev-glass-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-light text-webdev-silver">Profile Details</h2>
        {isEditing ? (
          <div className="flex gap-2">
            <button 
              onClick={handleSaveClick} 
              className="glass-effect px-4 py-2 rounded-xl text-webdev-silver hover:text-white transition-all duration-300 tracking-wide font-medium hover:scale-[1.02] relative overflow-hidden group border border-transparent hover:shadow-[0_0_20px_rgba(66,133,244,0.3),0_0_30px_rgba(138,43,226,0.2)] text-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span className="relative z-10">Save</span>
            </button>
            <button 
              onClick={handleCancelClick} 
              className="glass-effect px-4 py-2 rounded-xl text-webdev-silver hover:text-white transition-all duration-300 tracking-wide font-medium hover:scale-[1.02] relative overflow-hidden group border border-transparent hover:shadow-[0_0_20px_rgba(66,133,244,0.3),0_0_30px_rgba(138,43,226,0.2)] text-sm flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              <span className="relative z-10">Cancel</span>
            </button>
          </div>
        ) : (
          <button 
            onClick={handleEditClick} 
            className="glass-effect px-4 py-2 rounded-xl text-webdev-silver hover:text-white transition-all duration-300 tracking-wide font-medium hover:scale-[1.02] relative overflow-hidden group border border-transparent hover:shadow-[0_0_20px_rgba(66,133,244,0.3),0_0_30px_rgba(138,43,226,0.2)] text-sm flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            <span className="relative z-10">Edit Profile</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-webdev-soft-gray text-sm font-medium mb-2">Full Name</label>
          {isEditing ? (
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="glass-effect appearance-none border border-webdev-glass-border rounded w-full py-2 px-3 text-webdev-silver leading-tight focus:outline-none focus:ring-2 focus:ring-webdev-gradient-blue focus:border-transparent bg-webdev-darker-gray"
            />
          ) : (
            <div className="text-webdev-silver">{fullName || 'Not provided'}</div>
          )}
        </div>

        <div>
          <label className="block text-webdev-soft-gray text-sm font-medium mb-2">Email</label>
          <div className="text-webdev-silver">{user.email || 'Not provided'}</div>
        </div>

        <div>
          <label className="block text-webdev-soft-gray text-sm font-medium mb-2">Website</label>
          {isEditing ? (
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="glass-effect appearance-none border border-webdev-glass-border rounded w-full py-2 px-3 text-webdev-silver leading-tight focus:outline-none focus:ring-2 focus:ring-webdev-gradient-blue focus:border-transparent bg-webdev-darker-gray"
            />
          ) : (
            <a href={website} target="_blank" rel="noopener noreferrer" className="text-webdev-gradient-blue hover:text-webdev-gradient-purple transition-colors duration-300">
              {website || 'Not provided'}
            </a>
          )}
        </div>

        <div>
          <label className="block text-webdev-soft-gray text-sm font-medium mb-2">Created At</label>
          <div className="text-webdev-silver">
            {user.created_at ? format(new Date(user.created_at), 'MMMM dd, yyyy') : 'Not available'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
