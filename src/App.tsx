import { useState, useEffect } from 'react'
import './App.css'
import * as XLSX from 'xlsx'

function App() {
  const [data, setData] = useState<any[][]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchExcel = async () => {
      try {
        console.log('Starting to fetch Excel data...')
        
        // Try backend first, then Vercel API, then static file
        let response = await fetch('http://localhost:3001/api/data')
        console.log('Localhost response:', response.status, response.ok)
        
        if (!response.ok) {
          // Try Vercel API endpoint
          console.log('Trying Vercel API...')
          response = await fetch('/api/data')
          console.log('Vercel API response:', response.status, response.ok)
        }
        
        if (!response.ok) {
          // Fallback to static file in public directory
          console.log('Trying static file...')
          response = await fetch('/P&L expense processed data through June 2025 v2.xlsx')
          console.log('Static file response:', response.status, response.ok)
        }
        
        if (!response.ok) throw new Error('Failed to fetch Excel file')
        
        console.log('Successfully fetched file, parsing...')
        const blob = await response.blob()
        const arrayBuffer = await blob.arrayBuffer()
        const workbook = XLSX.read(arrayBuffer, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        console.log('Parsed data rows:', jsonData.length)
        setData(jsonData)
      } catch (err: any) {
        console.error('Error in fetchExcel:', err)
        setError(err.message || 'Error loading data')
      }
    }
    fetchExcel()
  }, [])

  return (
    <div>
      <h1>Expense Data (Pre-loaded)</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <table style={{ margin: '0 auto', borderCollapse: 'collapse' }}>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} style={{ border: '1px solid #ccc', padding: '4px 8px' }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
