
import { useState, useRef } from 'react';
import { Upload, X, File, Check } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
  label?: string;
}

const FileUploader = ({
  onFileSelect,
  accept = '.pdf',
  maxSize = 10,
  label = 'Upload File',
}: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const validateFile = (selectedFile: File): boolean => {
    // Validate file type
    const fileType = selectedFile.type;
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
    
    if (accept !== '*' && !accept.includes(fileExtension || '')) {
      setError(`Invalid file type. Please upload ${accept} files only.`);
      return false;
    }
    
    // Validate file size
    const fileSizeMB = selectedFile.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      setError(`File is too large. Maximum size is ${maxSize}MB.`);
      return false;
    }
    
    setError(null);
    return true;
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const selectedFile = e.dataTransfer.files[0];
      
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        onFileSelect(selectedFile);
      }
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        onFileSelect(selectedFile);
      }
    }
  };
  
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const clearFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept={accept}
        className="hidden"
      />
      
      {file ? (
        <div className="border subtle-border rounded-lg p-4 bg-background/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                <File className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium truncate max-w-[200px] sm:max-w-xs">
                  {file.name}
                </p>
                <p className="text-sm text-foreground/60">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-secondary rounded-full flex items-center justify-center">
                <Check className="h-4 w-4 text-primary" />
              </div>
              <button
                type="button"
                onClick={clearFile}
                className="h-8 w-8 bg-secondary rounded-full flex items-center justify-center hover:bg-secondary/80 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'subtle-border hover:border-primary/50 hover:bg-secondary/50'
          }`}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium">{label}</p>
              <p className="text-sm text-foreground/60 mt-1">
                Drop your file here, or click to browse
              </p>
              <p className="text-xs text-foreground/50 mt-2">
                {accept} files up to {maxSize}MB
              </p>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-2 text-sm text-destructive">
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
