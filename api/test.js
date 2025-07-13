import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    // Check if we can access the public directory
    const publicDir = path.join(process.cwd(), 'public');
    console.log('Public directory path:', publicDir);
    
    if (!fs.existsSync(publicDir)) {
      return res.status(404).json({ error: 'Public directory not found', path: publicDir });
    }
    
    // List all files in public directory
    const files = fs.readdirSync(publicDir);
    console.log('Files in public directory:', files);
    
    // Find Excel files
    const excelFiles = files.filter(file => 
      file.endsWith('.xlsx') || file.endsWith('.xls')
    ).filter(file => 
      !file.startsWith('~$')
    );
    
    console.log('Excel files found:', excelFiles);
    
    res.json({ 
      status: 'OK',
      publicDir,
      allFiles: files,
      excelFiles: excelFiles,
      message: 'API test successful'
    });
    
  } catch (error) {
    console.error('API test error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message,
      stack: error.stack
    });
  }
} 