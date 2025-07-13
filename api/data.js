import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Look for Excel files in the public directory
    const publicDir = path.join(process.cwd(), 'public');
    const files = fs.readdirSync(publicDir);
    const excelFiles = files.filter(file => 
      file.endsWith('.xlsx') || file.endsWith('.xls')
    ).filter(file => 
      !file.startsWith('~$') // Exclude temporary Excel files
    );
    
    if (excelFiles.length === 0) {
      return res.status(404).json({ error: 'No Excel files found' });
    }
    
    // Use the first Excel file found
    const fileName = excelFiles[0];
    const filePath = path.join(publicDir, fileName);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Excel file not found' });
    }
    
    // Read and serve the file
    const fileBuffer = fs.readFileSync(filePath);
    
    // Set cache-busting headers to prevent caching
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Last-Modified', new Date().toUTCString());
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.status(200).send(fileBuffer);
    
  } catch (error) {
    console.error('Error serving Excel file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 