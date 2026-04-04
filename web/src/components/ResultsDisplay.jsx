import { useState } from 'react';
import { Copy, Check, Eye, FileText, Search, Share2, Accessibility, Download } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function ResultsDisplay({ data }) {
    const [activeTab, setActiveTab] = useState('alt_text');
    const [copied, setCopied] = useState(null);

    const tabs = [
        { id: 'alt_text', label: 'Alt Text', icon: Accessibility },
        { id: 'detailed_description', label: 'Descrição', icon: FileText },
        { id: 'seo_keywords', label: 'SEO', icon: Search },
        { id: 'social_post', label: 'Social', icon: Share2 },
        { id: 'accessibility_analysis', label: 'Análise', icon: Eye },
    ];

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const textContent = `
=== DescreveAI - Relatório de Análise ===

[Texto Alternativo]
${data.alt_text}

[Descrição Detalhada]
${data.detailed_description}

[SEO Keywords]
${Array.isArray(data.seo_keywords) ? data.seo_keywords.join(', ') : data.seo_keywords}

[Análise de Acessibilidade]
${data.accessibility_analysis}

[Post para Redes Sociais]
${data.social_post}

Gerado por DescreveAI em ${new Date().toLocaleString()}
        `.trim();

        const blob = new Blob([textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'descreve-ai-relatorio.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const renderContent = () => {
        const content = data[activeTab];

        if (Array.isArray(content)) {
            return (
                <div className="flex flex-wrap gap-2">
                    {content.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            #{tag}
                        </span>
                    ))}
                </div>
            );
        }

        return <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{content}</p>;
    };

    const getContentText = () => {
        const content = data[activeTab];
        return Array.isArray(content) ? content.join(', ') : content;
    };

    return (
        <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            {/* Tabs Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 bg-gray-50/50">
                <div className="flex overflow-x-auto whitespace-nowrap scrollbar-hide flex-1">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all whitespace-nowrap",
                                    isActive
                                        ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                )}
                            >
                                <Icon size={18} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
                <div className="p-2 md:pr-4 flex justify-end">
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                        <Download size={16} />
                        Baixar Relatório
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                        {tabs.find(t => t.id === activeTab)?.label}
                    </h3>
                    <button
                        onClick={() => handleCopy(getContentText())}
                        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors px-3 py-1.5 rounded-md hover:bg-blue-50"
                        title="Copiar para área de transferência"
                    >
                        {copied ? (
                            <>
                                <Check size={16} className="text-green-500" />
                                <span className="text-green-600 font-medium">Copiado!</span>
                            </>
                        ) : (
                            <>
                                <Copy size={16} />
                                <span>Copiar</span>
                            </>
                        )}
                    </button>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 min-h-[120px]">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}
