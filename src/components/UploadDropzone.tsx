import { useState, useCallback } from 'react'
import { Upload, X, FileAudio } from 'lucide-react'

interface UploadDropzoneProps {
  label: string
  accept?: string
  multiple?: boolean
  files: File[]
  onFilesChange: (files: File[]) => void
}

export function UploadDropzone({
  label,
  accept = '.wav',
  multiple = false,
  files,
  onFilesChange,
}: UploadDropzoneProps) {
  const [dragActive, setDragActive] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragActive(false)
      const dropped = Array.from(e.dataTransfer.files).filter((f) =>
        f.name.toLowerCase().endsWith('.wav'),
      )
      if (multiple) {
        onFilesChange([...files, ...dropped])
      } else {
        onFilesChange(dropped.slice(0, 1))
      }
    },
    [files, multiple, onFilesChange],
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = Array.from(e.target.files ?? [])
      if (multiple) {
        onFilesChange([...files, ...selected])
      } else {
        onFilesChange(selected.slice(0, 1))
      }
    },
    [files, multiple, onFilesChange],
  )

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index))
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-studio-200">
        {label}
      </label>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all cursor-pointer ${
          dragActive
            ? 'border-accent-violet bg-accent-violet/10'
            : 'border-studio-600 bg-studio-800 hover:border-studio-500'
        }`}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
        <Upload
          className={`mb-3 h-10 w-10 ${
            dragActive ? 'text-accent-violet' : 'text-studio-500'
          }`}
        />
        <p className="text-sm text-studio-300">
          <span className="font-medium text-accent-violet">Click to upload</span>{' '}
          or drag and drop
        </p>
        <p className="mt-1 text-xs text-studio-500">
          WAV files only{multiple ? ' · Multiple files allowed' : ''}
        </p>
      </div>

      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className="flex items-center gap-3 rounded-lg bg-studio-700 px-3 py-2"
            >
              <FileAudio className="h-4 w-4 text-accent-cyan shrink-0" />
              <span className="flex-1 truncate text-sm text-studio-200">
                {file.name}
              </span>
              <span className="text-xs text-studio-500">
                {(file.size / 1024 / 1024).toFixed(1)} MB
              </span>
              <button
                onClick={() => removeFile(i)}
                className="rounded p-1 text-studio-400 hover:bg-studio-600 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
