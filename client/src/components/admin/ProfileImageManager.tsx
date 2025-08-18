import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/hooks/useProfile';
import { 
  Upload, 
  Camera, 
  Trash2, 
  Loader2,
  User,
  Crop
} from 'lucide-react';

export default function ProfileImageManager() {
  const { profile, loading, uploading, uploadProfileImage, removeProfileImage } = useProfile();
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      await uploadProfileImage(selectedFile);
      setSelectedFile(null);
      setPreviewUrl('');
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleRemove = async () => {
    if (window.confirm('Are you sure you want to remove your profile image?')) {
      await removeProfileImage();
    }
  };

  const resetSelection = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <Card className="glass-effect border-gold/20 bg-transparent">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-700 rounded mb-4"></div>
            <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4"></div>
            <div className="h-10 bg-gray-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="glass-effect border-gold/20 bg-transparent">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gold flex items-center">
            <Camera className="w-6 h-6 mr-2" />
            Profile Image Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Profile Image */}
          <div className="text-center">
            <div className="relative inline-block">
              {profile.profileImageUrl || previewUrl ? (
                <img
                  src={previewUrl || profile.profileImageUrl}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-gold/30 shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-700 border-4 border-gold/30 flex items-center justify-center">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
              )}
              {previewUrl && (
                <div className="absolute top-0 right-0 bg-blue-500 rounded-full p-1">
                  <Crop className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <p className="text-gray-400 mt-2 text-sm">
              {profile.profileImageUrl ? 'Current profile image' : 'No profile image set'}
            </p>
          </div>

          {/* Upload Area */}
          {!selectedFile && (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging 
                  ? 'border-gold bg-gold/10' 
                  : 'border-gray-600 hover:border-gold/50'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 mb-2">
                Drag and drop an image here, or click to select
              </p>
              <p className="text-gray-500 text-sm mb-4">
                Supports JPG, PNG, GIF up to 10MB
              </p>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="border-gold text-gold hover:bg-gold hover:text-black"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
              />
            </div>
          )}

          {/* Preview and Actions */}
          {selectedFile && (
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">Selected Image:</h4>
                <p className="text-gray-400 text-sm">{selectedFile.name}</p>
                <p className="text-gray-500 text-xs">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex-1 bg-gradient-to-r from-gold to-gold-light text-black font-semibold"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={resetSelection}
                  disabled={uploading}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Remove Current Image */}
          {profile.profileImageUrl && !selectedFile && (
            <div className="pt-4 border-t border-gray-700">
              <Button
                variant="outline"
                onClick={handleRemove}
                disabled={uploading}
                className="w-full border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove Current Image
              </Button>
            </div>
          )}

          {/* Usage Info */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="text-blue-400 font-medium mb-2 flex items-center">
              <Camera className="w-4 h-4 mr-2" />
              Image Guidelines
            </h4>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>• Use a high-quality, professional headshot</li>
              <li>• Square aspect ratio works best (1:1)</li>
              <li>• Minimum resolution: 400x400 pixels</li>
              <li>• Face should be clearly visible and centered</li>
              <li>• Avoid busy backgrounds</li>
            </ul>
          </div>

          {profile.lastUpdated && (
            <p className="text-gray-500 text-xs text-center">
              Last updated: {profile.lastUpdated.toLocaleString()}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
