import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useResume } from "@/hooks/useResume";
import { 
  Upload, 
  FileText, 
  Trash2, 
  Download,
  Loader2,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  FileIcon
} from "lucide-react";

export default function ResumeManager() {
  const { 
    resumeData, 
    loading, 
    uploading, 
    uploadProgress, 
    uploadResume, 
    deleteResume, 
    downloadResume, 
    viewResume 
  } = useResume();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await uploadResume(file);
        // Clear the input for future uploads
        e.target.value = '';
      } catch (error) {
        // Error is handled in the hook
        e.target.value = '';
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete the current resume? This action cannot be undone.')) {
      try {
        await deleteResume();
      } catch (error) {
        // Error is handled in the hook
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return <FileText className="w-8 h-8 text-red-500" />;
    } else if (fileType.includes('word')) {
      return <FileIcon className="w-8 h-8 text-blue-500" />;
    }
    return <FileText className="w-8 h-8 text-gray-500" />;
  };

  if (loading) {
    return (
      <Card className="glass-effect border-gold/20 bg-transparent">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-700 rounded mb-4"></div>
            <div className="h-4 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
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
            <FileText className="w-6 h-6 mr-2" />
            Resume Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Progress */}
          {uploading && uploadProgress !== undefined && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Upload Progress</span>
                <span className="text-sm text-gold">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-gray-500 text-center">
                Uploading resume to secure storage...
              </p>
            </div>
          )}

          {/* Current Resume Display */}
          {resumeData ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="bg-gradient-to-br from-luxury-light to-gray-800/50 p-6 rounded-lg border border-gold/20">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    {getFileTypeIcon(resumeData.fileType)}
                    <div>
                      <h3 className="font-semibold text-white text-lg mb-1">
                        {resumeData.filename}
                      </h3>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-400">
                          <strong>Size:</strong> {formatFileSize(resumeData.fileSize)}
                        </p>
                        <p className="text-sm text-gray-400">
                          <strong>Type:</strong> {resumeData.fileType.split('/')[1].toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-400">
                          <strong>Uploaded:</strong> {resumeData.uploadedAt.toLocaleDateString()} at {resumeData.uploadedAt.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadResume}
                    className="text-gold border-gold hover:bg-gold hover:text-black"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={viewResume}
                    className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View in Browser
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDelete}
                    disabled={uploading}
                    className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>

              {/* Status Info */}
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  <p className="text-green-400 text-sm">
                    <strong>Resume Active:</strong> Your resume is available for download on the public website
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-20 h-20 mx-auto text-gray-400 mb-6" />
              <h3 className="text-xl font-semibold text-gold mb-2">No Resume Uploaded</h3>
              <p className="text-gray-300 mb-6 max-w-md mx-auto">
                Upload your resume to make it available for download on your portfolio website. 
                Visitors will be able to download and view your resume directly.
              </p>
              
              {/* No Resume Warning */}
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-orange-400 mr-2" />
                  <p className="text-orange-400 text-sm">
                    Resume buttons on your website are currently disabled
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Upload Section */}
          <div className="space-y-4">
            <div className="border-t border-gray-700 pt-6">
              <input
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileSelect}
                className="hidden"
                id="resume-upload"
                disabled={uploading}
              />
              <Button
                type="button"
                onClick={() => document.getElementById("resume-upload")?.click()}
                disabled={uploading}
                className="w-full bg-gradient-to-r from-gold to-gold-light text-black font-semibold py-4 text-lg"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Uploading Resume...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    {resumeData ? "Replace Resume" : "Upload Resume"}
                  </>
                )}
              </Button>
              
              {/* File Requirements */}
              <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h4 className="text-blue-400 font-medium mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  File Requirements
                </h4>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• <strong>Formats:</strong> PDF, DOC, DOCX</li>
                  <li>• <strong>Max Size:</strong> 10MB</li>
                  <li>• <strong>Recommended:</strong> PDF format for best compatibility</li>
                  <li>• <strong>Security:</strong> Files are stored securely and accessible only via your website</li>
                  <li>• <strong>Real-time:</strong> Changes appear instantly on your portfolio</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
