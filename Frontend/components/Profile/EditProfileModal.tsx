import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaCamera } from 'react-icons/fa';
import axios from 'axios';
import { BASE_API_URL } from '@/server';
import Image from 'next/image';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    _id: string;
    username: string;
    name: string;
    email: string;
    bio?: string;
    profilePicture?: string;
  };
  onProfileUpdate: (updatedUser: any) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onProfileUpdate,
}) => {
  const [bio, setBio] = useState(user.bio || '');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(user.profilePicture || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset states when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setBio(user.bio || '');
      setPreviewUrl(user.profilePicture || '');
      setProfilePicture(null);
      setError('');
    }
  }, [isOpen, user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(''); // Clear any previous errors
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      
      // Add bio if it exists
      if (bio) {
        formData.append('bio', bio);
      }

      // Handle profile picture upload
      if (profilePicture) {
        // Create a new File object with the correct type
        const imageFile = new File(
          [profilePicture],
          profilePicture.name,
          { type: profilePicture.type }
        );

        // Log the file details for debugging
        console.log('Uploading file:', {
          name: imageFile.name,
          type: imageFile.type,
          size: imageFile.size
        });

        // Append the file to FormData with the correct field name
        formData.append('profilePicture', imageFile);
      }

      // Log the FormData contents for debugging
      for (let pair of formData.entries()) {
        console.log('FormData entry:', pair[0], pair[1]);
      }

      const response = await axios.patch(
        `${BASE_API_URL}/users/profile`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          // Add timeout and validate status
          timeout: 10000,
          validateStatus: (status) => status < 500,
        }
      );

      console.log('Server response:', response.data);

      if (response.data.status === 'success') {
        onProfileUpdate(response.data.data.user);
        onClose();
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (err: any) {
      console.error('Profile update error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      // Extract error message from HTML response if needed
      let errorMessage = 'Failed to update profile. Please try again.';
      if (err.response?.data) {
        if (typeof err.response.data === 'string' && err.response.data.includes('<!DOCTYPE html>')) {
          errorMessage = 'Server error occurred. Please try again later.';
        } else {
          errorMessage = err.response.data.message || err.message || errorMessage;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6 relative shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              <Image
                src={previewUrl || `https://avatar.iran.liara.run/public/boy?username=${user.username}`}
                alt="Profile"
                fill
                className="rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://avatar.iran.liara.run/public/boy?username=${user.username}`;
                }}
              />
              <label
                htmlFor="profilePicture"
                className={`absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <FaCamera size={16} />
              </label>
              <input
                type="file"
                id="profilePicture"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={150}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              rows={3}
              placeholder="Write something about yourself..."
              disabled={isLoading}
            />
            <p className="text-sm text-gray-500 mt-1">
              {bio.length}/150 characters
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                <span>Saving...</span>
              </div>
            ) : (
              'Save Changes'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal; 