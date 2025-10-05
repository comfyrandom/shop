// components/FileUploadWidget.tsx
import React, { useState, useRef } from 'react';
import {supabase} from "../../services/supabase.client.ts";

interface FileUploadWidgetProps {
    bucketName: string;
    onUploadComplete: (fileUrl: string) => void;
    maxFileSize?: number; // в байтах, по умолчанию 5MB
}

interface UploadState {
    isUploading: boolean;
    progress: number;
    error: string | null;
    uploadedUrl: string | null;
}

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const DEFAULT_MAX_FILE_SIZE = 1 * 1024 * 1024; // 5MB

const FileUploadWidget: React.FC<FileUploadWidgetProps> = ({
                                                               bucketName,
                                                               onUploadComplete,
                                                               maxFileSize = DEFAULT_MAX_FILE_SIZE,
                                                           }) => {
    const [uploadState, setUploadState] = useState<UploadState>({
        isUploading: false,
        progress: 0,
        error: null,
        uploadedUrl: null,
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): string | null => {
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            return 'Разрешены только файлы JPG, PNG и WebP';
        }

        if (file.size > maxFileSize) {
            return `Размер файла должен быть меньше ${maxFileSize / 1024 / 1024}MB`;
        }

        return null;
    };

    const generateFileName = (file: File): string => {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const extension = file.name.split('.').pop();
        return `${timestamp}-${randomString}.${extension}`;
    };

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Сброс состояния
        setUploadState({
            isUploading: false,
            progress: 0,
            error: null,
            uploadedUrl: null,
        });

        // Проверка файла
        const validationError = validateFile(file);
        if (validationError) {
            setUploadState(prev => ({ ...prev, error: validationError }));
            return;
        }

        await uploadFile(file);
    };

    const uploadFile = async (file: File) => {
        try {
            setUploadState(prev => ({ ...prev, isUploading: true, error: null }));

            const fileName = generateFileName(file);

            const { error } = await supabase.storage
                .from(bucketName)
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false,
                });

            if (error) {
                throw new Error(error.message);
            }

            // Получение публичного URL
            const { data: urlData } = supabase.storage
                .from(bucketName)
                .getPublicUrl(fileName);

            setUploadState({
                isUploading: false,
                progress: 100,
                error: null,
                uploadedUrl: urlData.publicUrl,
            });

            onUploadComplete(urlData.publicUrl);
        } catch (error) {
            setUploadState(prev => ({
                ...prev,
                isUploading: false,
                error: error instanceof Error ? error.message : 'Ошибка загрузки',
            }));
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();

        const file = event.dataTransfer.files?.[0];
        if (!file) return;

        const validationError = validateFile(file);
        if (validationError) {
            setUploadState(prev => ({ ...prev, error: validationError }));
            return;
        }

        uploadFile(file);
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const resetUpload = () => {
        setUploadState({
            isUploading: false,
            progress: 0,
            error: null,
            uploadedUrl: null,
        });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            {/* Скрытый input для файлов */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".jpg,.jpeg,.png,.webp"
                className="hidden"
            />

            {/* Область загрузки */}
            <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    uploadState.isUploading
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={triggerFileInput}
            >
                {uploadState.isUploading ? (
                    <div className="space-y-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadState.progress}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-600">Загрузка... {uploadState.progress}%</p>
                    </div>
                ) : uploadState.uploadedUrl ? (
                    <div className="space-y-2">
                        <div className="text-green-600">
                            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-sm text-green-600 font-medium">Загрузка успешна!</p>
                        <div className="flex justify-center space-x-2 mt-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(uploadState.uploadedUrl!, '_blank');
                                }}
                                className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                            >
                                Посмотреть изображение
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    resetUpload();
                                }}
                                className="text-xs bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors"
                            >
                                Загрузить новое
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <svg className="w-8 h-8 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-sm font-medium text-gray-700">Перетащите изображение сюда</p>
                        <p className="text-xs text-gray-500">или нажмите для выбора</p>
                        <p className="text-xs text-gray-400">Поддерживаемые: JPG, PNG, WebP (Макс: {maxFileSize / 1024 / 1024}MB)</p>
                    </div>
                )}
            </div>

            {/* Сообщение об ошибке */}
            {uploadState.error && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {uploadState.error}
                    </p>
                </div>
            )}

            {/* Превью */}
            {uploadState.uploadedUrl && (
                <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Превью:</p>
                    <img
                        src={uploadState.uploadedUrl}
                        alt="Превью загруженного изображения"
                        className="max-w-full h-auto rounded-lg border border-gray-200"
                    />
                </div>
            )}
        </div>
    );
};

export default FileUploadWidget;