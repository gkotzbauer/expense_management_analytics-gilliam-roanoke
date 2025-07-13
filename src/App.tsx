import { useState, useEffect } from "react"
import "./App.css"
import * as XLSX from "xlsx"

function App() {
  const [data, setData] = useState<any[][]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchExcel = async () => {
      try {
        const response = await fetch("/P&L expense processed data through June 2025 v2.xlsx")
        if (!response.ok) throw new Error("Failed to fetch Excel file")
        
        const blob = await response.blob()
        const arrayBuffer = await blob.arrayBuffer()
        const workbook = XLSX.read(arrayBuffer, { type: "array" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        setData(jsonData)
      } catch (err: any) {
        setError(err.message || "Error loading data")
      }
    }
    fetchExcel()
  }, [])

  return (
    <div>
      <h1>Expense Data (Pre-loaded)</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
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
