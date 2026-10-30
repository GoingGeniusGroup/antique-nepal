'use client';

import React from 'react';
import { FileUploaderRegular } from '@uploadcare/react-uploader/next';
import '@uploadcare/react-uploader/core.css';

interface FileUploaderProps {
  onUploadSuccess?: (url: string) => void;
}

export default function FileUploader({ onUploadSuccess }: FileUploaderProps) {
  const pubkey = process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY || '';

  const handleChangeEvent = (items: any) => {
    const successfulUploads = items.allEntries.filter(
      (file: any) => file.status === 'success'
    );

    if (successfulUploads.length > 0) {
      const cdnUrl = successfulUploads[0].cdnUrl;
      console.log('Uploaded File CDN URL:', cdnUrl);
      if (onUploadSuccess) {
        onUploadSuccess(cdnUrl);
      }
    }
  };

  return (
    <div>
      <FileUploaderRegular
        pubkey={pubkey}
        ctxName="my-uploader"
        onChange={handleChangeEvent}
      />
    </div>
  );
}