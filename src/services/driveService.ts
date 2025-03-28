
// Simple mock service for Google Drive file operations
// In a real implementation, this would use the Google Drive API

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  webViewLink: string;
  downloadUrl: string;
  thumbnailUrl?: string;
  createdTime: string;
  modifiedTime: string;
}

class GoogleDriveService {
  private mockFiles: DriveFile[] = [];
  private connected: boolean = false;
  private apiKey: string | null = null;
  
  constructor() {
    // Try to load mock files from localStorage
    try {
      const storedFiles = localStorage.getItem('googleDriveMockFiles');
      if (storedFiles) {
        this.mockFiles = JSON.parse(storedFiles);
      }
    } catch (e) {
      console.error("Error loading mock files from localStorage", e);
    }
    
    // Check if we have an API key for Google Drive
    this.apiKey = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY || null;
    console.log("Google Drive Service initialized", this.apiKey ? "with API key" : "in mock mode");
  }
  
  // Save mock files to localStorage
  private saveToLocalStorage() {
    try {
      localStorage.setItem('googleDriveMockFiles', JSON.stringify(this.mockFiles));
    } catch (e) {
      console.error("Error saving mock files to localStorage", e);
    }
  }
  
  // Connect to Google Drive
  async connect(): Promise<void> {
    if (this.connected) {
      return;
    }
    
    try {
      // In a real implementation, this would authenticate with Google Drive API
      // For mock mode, just set connected flag
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
      this.connected = true;
      console.log("Connected to Google Drive");
    } catch (error) {
      console.error("Error connecting to Google Drive:", error);
      throw error;
    }
  }
  
  // Check if connected
  isConnected(): boolean {
    return this.connected;
  }
  
  // Close connection
  async disconnect(): Promise<void> {
    this.connected = false;
  }
  
  // Upload file
  async uploadFile(file: File, folderId?: string): Promise<DriveFile> {
    if (!this.connected) {
      throw new Error("Not connected to Google Drive");
    }
    
    // In a real implementation, this would upload to Google Drive
    // For mock mode, create a mock file entry
    
    // Read file as data URL for mock storage
    const dataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
    
    // Store in local storage (for images we might want to limit size)
    localStorage.setItem(`file_${file.name}`, dataUrl);
    
    const mockFile: DriveFile = {
      id: Math.random().toString(36).substring(2, 15),
      name: file.name,
      mimeType: file.type,
      size: file.size,
      webViewLink: dataUrl,
      downloadUrl: dataUrl,
      thumbnailUrl: file.type.startsWith('image/') ? dataUrl : undefined,
      createdTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString()
    };
    
    this.mockFiles.push(mockFile);
    this.saveToLocalStorage();
    
    return mockFile;
  }
  
  // Get file by ID
  async getFile(fileId: string): Promise<DriveFile | null> {
    if (!this.connected) {
      throw new Error("Not connected to Google Drive");
    }
    
    const file = this.mockFiles.find(f => f.id === fileId);
    return file || null;
  }
  
  // List files
  async listFiles(folderId?: string): Promise<DriveFile[]> {
    if (!this.connected) {
      throw new Error("Not connected to Google Drive");
    }
    
    return [...this.mockFiles];
  }
  
  // Delete file
  async deleteFile(fileId: string): Promise<boolean> {
    if (!this.connected) {
      throw new Error("Not connected to Google Drive");
    }
    
    const initialCount = this.mockFiles.length;
    this.mockFiles = this.mockFiles.filter(f => f.id !== fileId);
    
    if (initialCount !== this.mockFiles.length) {
      this.saveToLocalStorage();
      return true;
    }
    
    return false;
  }
}

// Export singleton instance
export const driveService = new GoogleDriveService();
