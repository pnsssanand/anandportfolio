import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useProfile } from '@/hooks/useProfile';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { 
  Upload, 
  Camera, 
  Trash2, 
  Loader2,
  User,
  Crop as CropIcon,
  CheckCircle,
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProfileImageManager() {
  const { profile, loading, uploading, uploadProgress, uploadProfileImage, removeProfileImage } = useProfile();
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 80,
    height: 80,
    x: 10,
    y: 10
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [validationError, setValidationError] = useState<string>('');
  
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Validate image file before processing
  const validateImage = (file: File): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      // Check file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setValidationError('Please upload a JPG, JPEG, or PNG image file.');
        return resolve(false);
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setValidationError('File size must be less than 10MB.');
        return resolve(false);
      }

      // Check image dimensions
      const img = new Image();
      img.onload = () => {
        if (img.width < 400 || img.height < 400) {
          setValidationError('Image must be at least 400x400 pixels.');
          resolve(false);
        } else {
          setValidationError('');
          resolve(true);
        }
      };
      img.onerror = () => {
        setValidationError('Invalid image file.');
        resolve(false);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const isValid = await validateImage(file);
      if (!isValid) return;

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
        setShowCropper(true);
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

  // Get cropped image blob - Function to extract cropped area from canvas
  const getCroppedImg = useCallback(
    (image: HTMLImageElement, crop: PixelCrop): Promise<Blob> => {
      return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('No 2d context'));
          return;
        }

        // Set canvas size to crop dimensions
        canvas.width = crop.width;
        canvas.height = crop.height;

        // Draw the cropped image
        ctx.drawImage(
          image,
          crop.x,
          crop.y,
          crop.width,
          crop.height,
          0,
          0,
          crop.width,
          crop.height
        );

        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Canvas is empty'));
            return;
          }
          resolve(blob);
        }, 'image/jpeg', 0.9);
      });
    },
    []
  );

  const handleUpload = async () => {
    if (!selectedFile || !completedCrop || !imgRef.current) return;
    
    try {
      // Get cropped image blob
      const croppedImageBlob = await getCroppedImg(imgRef.current, completedCrop);
      
      // Create a new File from the blob with proper naming
      const croppedFile = new File(
        [croppedImageBlob], 
        `profile-${Date.now()}.jpg`, 
        { type: 'image/jpeg' }
      );
      
      // Upload cropped image to Cloudinary via Firebase
      await uploadProfileImage(croppedFile);
      
      // Reset states after successful upload
      setSelectedFile(null);
      setPreviewUrl('');
      setShowCropper(false);
      setCompletedCrop(undefined);
      setCrop({
        unit: '%',
        width: 80,
        height: 80,
        x: 10,
        y: 10
      });
      
      toast({
        title: "Success!",
        description: "Profile image uploaded and updated successfully",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error uploading cropped image:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload cropped image. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
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
    setShowCropper(false);
    setCompletedCrop(undefined);
    setValidationError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget;
    
    // Set initial crop to center square
    const size = Math.min(width, height) * 0.8;
    const x = (width - size) / 2;
    const y = (height - size) / 2;
    
    setCrop({
      unit: 'px',
      width: size,
      height: size,
      x,
      y
    });
  }, []);

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
              {showCropper && (
                <div className="absolute top-0 right-0 bg-blue-500 rounded-full p-1">
                  <CropIcon className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <p className="text-gray-400 mt-2 text-sm">
              {profile.profileImageUrl ? 'Current profile image' : 'No profile image set'}
            </p>
          </div>

          {/* Validation Error Display */}
          {validationError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
                <p className="text-red-400 text-sm">{validationError}</p>
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {uploading && uploadProgress !== undefined && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Upload Progress</span>
                <span className="text-sm text-gold">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Image Cropper */}
          {showCropper && previewUrl && (
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-white font-medium mb-4 flex items-center">
                  <CropIcon className="w-4 h-4 mr-2" />
                  Crop Your Profile Image
                </h4>
                <div className="max-w-md mx-auto">
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={1}
                    circularCrop
                  >
                    <img
                      ref={imgRef}
                      alt="Crop preview"
                      src={previewUrl}
                      style={{ maxHeight: '400px', maxWidth: '100%' }}
                      onLoad={onImageLoad}
                    />
                  </ReactCrop>
                </div>
                <p className="text-gray-400 text-xs mt-2 text-center">
                  Drag to reposition • Resize corners to adjust • Preview shows final circular crop
                </p>
              </div>
            </div>
          )}

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
                Supports JPG, JPEG, PNG • Min 400x400px • Max 10MB
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
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleInputChange}
                className="hidden"
              />
            </div>
          )}

          {/* Selected File Info and Actions */}
          {selectedFile && (
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">Selected Image:</h4>
                <p className="text-gray-400 text-sm">{selectedFile.name}</p>
                <p className="text-gray-500 text-xs">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type}
                </p>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  onClick={handleUpload}
                  disabled={uploading || !completedCrop}
                  className="flex-1 bg-gradient-to-r from-gold to-gold-light text-black font-semibold"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Upload Cropped Image
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={resetSelection}
                  disabled={uploading}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
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
              <li>• Minimum resolution: 400x400 pixels</li>
              <li>• Accepted formats: JPG, JPEG, PNG (Max 10MB)</li>
              <li>• Image will be cropped to circular shape</li>
              <li>• Face should be clearly visible and centered</li>
              <li>• Avoid busy backgrounds for best results</li>
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
