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
          <div>
            <button onClick={handleSaveClick} className="glass-effect rounded-lg px-4 py-2 mr-2 border border-webdev-glass-border hover:bg-webdev-purple-300 transition-colors duration-300">
              <Save className="w-5 h-5 mr-2 inline-block align-middle" /> Save
            </button>
            <button onClick={handleCancelClick} className="glass-effect rounded-lg px-4 py-2 border border-webdev-glass-border hover:bg-webdev-red-300 transition-colors duration-300">
              <X className="w-5 h-5 mr-2 inline-block align-middle" /> Cancel
            </button>
          </div>
        ) : (
          <button onClick={handleEditClick} className="glass-effect rounded-lg px-4 py-2 border border-webdev-glass-border hover:bg-webdev-blue-300 transition-colors duration-300">
            <Edit3 className="w-5 h-5 mr-2 inline-block align-middle" /> Edit Profile
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
              className="shadow-sm glass-effect appearance-none border rounded w-full py-2 px-3 text-webdev-silver leading-tight focus:outline-none focus:shadow-outline border-webdev-glass-border"
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
              className="shadow-sm glass-effect appearance-none border rounded w-full py-2 px-3 text-webdev-silver leading-tight focus:outline-none focus:shadow-outline border-webdev-glass-border"
            />
          ) : (
            <a href={website} target="_blank" rel="noopener noreferrer" className="text-webdev-blue hover:text-webdev-purple transition-colors duration-300">
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
