export interface StorageProvider {
  getUploadUrl(
    path: string,
    contentType: string
  ): Promise<{ uploadUrl: string; path: string }>
  getDownloadUrl(path: string): Promise<string>
  delete(path: string): Promise<void>
}
