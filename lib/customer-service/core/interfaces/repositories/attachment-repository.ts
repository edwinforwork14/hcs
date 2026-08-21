export interface AttachmentRepository {
  getUploadUrl(
    conversationId: string,
    fileName: string,
    fileType: string,
    fileSize: number
  ): Promise<{ uploadUrl: string; path: string }>
  getDownloadUrl(path: string): Promise<string>
  delete(path: string): Promise<void>
}
