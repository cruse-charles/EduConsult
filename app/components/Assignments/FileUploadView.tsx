import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FileText, Upload, X } from 'lucide-react'

interface FileUploadViewProps {
    handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    removeFile: (index: number) => void;
    files: File[];
}

function FileUploadView({handleFileUpload, removeFile, files}: FileUploadViewProps) {
    return (
        <>
            <div className="space-y-4">
                <div className="space-y-2">
                <Label>Attach Files</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                    <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                        <div className="mt-2">
                            <Label htmlFor="file-upload" className="cursor-pointer">
                            <span className="text-sm font-medium text-primary hover:text-primary/80">
                                Click to upload files
                            </span>
                            <span className="text-sm text-muted-foreground"> or drag and drop</span>
                            </Label>
                            <Input
                            id="file-upload"
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileUpload}
                            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                            />
                        </div>
                    </div>
                </div>

                {files.length > 0 && (
                    <div className="space-y-2">
                    <Label className="text-sm font-medium">Attached Files:</Label>
                        <div className="space-y-2">
                            {files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                                <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{file.name}</span>
                                <span className="text-xs text-muted-foreground">
                                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                                </div>
                                <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            ))}
                        </div>
                    </div>
                )}
                </div>
            </div>
        </>
    )
}

export default FileUploadView