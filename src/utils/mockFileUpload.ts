
import { v4 as uuidv4 } from 'uuid';

export const uploadFile = async (file: File, folderPath: string): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Create a mock URL for the uploaded file
  const fileName = `${uuidv4()}.${file.name.split('.').pop()}`;
  const mockUrl = `https://example.com/storage/${folderPath}/${fileName}`;
  
  // For testing, we can create an object URL from the file
  // This will actually work in the browser for preview purposes
  const objectUrl = URL.createObjectURL(file);
  console.log(`Mock upload: ${file.name} to ${folderPath}, using object URL: ${objectUrl}`);
  
  // Return the mock URL (in a real app, this would be the actual URL from Supabase)
  return mockUrl;
};
