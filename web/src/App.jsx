import { useState } from 'react'
import Upload from './components/Upload'
import Footer from './components/Footer'

function App() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <div className="flex-grow py-10 px-4">
                <div className="max-w-4xl mx-auto">
                    <header className="text-center mb-10">
                        <h1 className="text-4xl font-extrabold text-blue-900 mb-2">Descreve.ai</h1>
                        <p className="text-gray-600">Acessibilidade visual com Inteligência Artificial</p>
                    </header>

                    <main>
                        <Upload />
                    </main>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default App
