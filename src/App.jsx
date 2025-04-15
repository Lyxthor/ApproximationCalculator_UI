import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import FormulaField from './components/FormulaField'
import ResultTable from "./components/ResultTable"


function App() {
  const [data, setData]= useState([])
  

  return (
    <div className='max-w-4xl mx-auto'>
      <header className='px-8 pt-8'>
        <h1 className='text-xl font-bold mb-4'>Bisection Method Calculator</h1>
        <nav>
          <ul className="flex">
            <li><a href="" className='btn'>Bisection</a></li>
            <li><a href="" className='btn'>Table</a></li>
          </ul>
        </nav>
      </header>
      <main className="w-full flex flex-wrap lg:flex-nowrap gap-8 p-8">
        {/* <input type="text" name="" id="" value={coba} onChange={e=>{setCoba(e.target.value)}}/> */}
        <section className='w-full order-2 lg:w-1/3 lg:order-1'>
          <FormulaField setData={setData} />
        </section>
        <section className="w-full order-1 lg:w-2/3 lg:order-2 pt-8">
          <ResultTable data={data} />
        </section>
      </main>
    </div>
    
  )
  
  
}

export default App
