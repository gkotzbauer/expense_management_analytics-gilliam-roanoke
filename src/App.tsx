import { useState, useEffect } from "react"
import "./App.css"
import * as XLSX from "xlsx"

function App() {
  const [data, setData] = useState<any[][]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchExcel = async () => {
      try {
        console.log("Starting to fetch Excel data...")
        
        // Try to find any Excel file in the public folder
        const excelPatterns = [
          "data.xlsx",
          "expense_data.xlsx", 
          "expenses.xlsx",
          "financial_data.xlsx"
        ]
        
        let response = null
        let fileName = ""
        
        // Try each pattern until we find a working Excel file
        for (const pattern of excelPatterns) {
          try {
            console.log(`Trying pattern: ${pattern}`)
            const timestamp = new Date().getTime()
            response = await fetch(`/${pattern}?t=${timestamp}`)
            console.log(`Response status for ${pattern}:`, response.status, response.ok)
            
            if (response.ok) {
              fileName = pattern
              break
            }
          } catch (err) {
            console.log(`Failed to fetch ${pattern}:`, err)
            continue
          }
        }
        
        if (!response || !response.ok) {
          throw new Error("No Excel file found in public folder")
        }
        
        console.log(`Successfully fetched file: ${fileName}`)
        console.log("Successfully fetched file, parsing...")
        const blob = await response.blob()
        const arrayBuffer = await blob.arrayBuffer()
        const workbook = XLSX.read(arrayBuffer, { type: "array" })
        console.log("Workbook sheets:", workbook.SheetNames)
        
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        console.log("Parsed data rows:", jsonData.length)
        console.log("First few rows:", jsonData.slice(0, 3))
        
        setData(jsonData)
      } catch (err: any) {
        console.error("Error in fetchExcel:", err)
        setError(err.message || "Error loading data")
      }
    }
    fetchExcel()
  }, [])

  return (
    <div>
      <h1>Expense Data (Pre-loaded)</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <div>Data rows: {data.length}</div>
      <table style={{ margin: "0 auto", borderCollapse: "collapse" }}>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} style={{ border: "1px solid #ccc", padding: "4px 8px" }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
