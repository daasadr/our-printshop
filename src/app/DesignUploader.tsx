import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

interface DesignUploaderProps {
  onDesignUploaded: (design: Design) => void;
}

interface Design {
  id: string;
  name: string;
  printfulFileId: string;
  previewUrl: string;
}

interface FormValues {
  name: string;
}

const DesignUploader: React.FC<DesignUploaderProps> = ({ onDesignUploaded }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>();

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/svg+xml': ['.svg']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 1
  });

  const onSubmit = async (data: FormValues) => {
    if (!selectedFile) return;
    
    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('name', data.name);
      
      const response = await fetch('/api/designs/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload design');
      }
      
      const result = await response.json();
      onDesignUploaded(result.design);
      reset();
      setPreview(null);
      setSelectedFile(null);
      
    } catch (error) {
      console.error('Error uploading design:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Nahrát nový design</h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Název designu</label>
          <input
            type="text"
            {...register('name', { required: 'Zadejte název designu' })}
            className="w-full p-2 border rounded-md"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Soubor designu (PNG, JPEG, SVG)</label>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${
              isDragActive ? 'bg-blue-50 border-blue-300' : 'border-gray-300'
            }`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p className="text-blue-500">Přetáhněte soubor sem...</p>
            ) : (
              <p>Přetáhněte soubor sem, nebo klikněte pro výběr souboru</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Podporované formáty: PNG, JPEG, SVG (max 10MB)
            </p>
          </div>
        </div>
        
        {preview && (
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Náhled:</h3>
            <div className="border rounded-md p-4">
              <Image
                src={preview}
                alt="Náhled designu"
                width={200}
                height={200}
                unoptimized
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        )}
        
        <div className="mt-6">
          <button
            type="submit"
            disabled={isUploading || !selectedFile}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isUploading ? 'Nahrávání...' : 'Nahrát design'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DesignUploader;