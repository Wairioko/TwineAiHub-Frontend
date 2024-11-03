import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState } from 'react';
import remarkGfm from 'remark-gfm';

export const getTimeDifference = (updatedAt) => {
    const diffInMs = Date.now() - new Date(updatedAt).getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);

    if (diffInSeconds < 60) {
        return `${diffInSeconds} seconds`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} minutes`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} hours`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days`;
};

export const MarkdownResponse = ({ text }) => {
    return (
        <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]} // Enable GitHub-flavored Markdown
                components={{
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <CodeBlock
                                language={match[1]}
                                value={String(children).replace(/\n$/, '')}
                                {...props}
                            />
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                    img({ node, ...props }) {
                        return <img className="custom-image" style={{ maxWidth: '100%', borderRadius: '0.5rem' }} {...props} />;
                    },
                    table({ children }) {
                        return <table className="custom-table" style={{ width: '100%', borderCollapse: 'collapse' }}>{children}</table>;
                    },
                    th({ children }) {
                        return <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>{children}</th>;
                    },
                    td({ children }) {
                        return <td style={{ border: '1px solid #ddd', padding: '8px' }}>{children}</td>;
                    },
                }}
            >
                {text}
            </ReactMarkdown>
        </div>
    );
};

export const CodeBlock = ({ language, value }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="code-block-container">
            <div className="code-block-header">
                <span className="language-tag">{language}: </span>
                <button
                    onClick={copyToClipboard}
                    className="copy-button-single-page"
                    style={{
                        marginLeft: '0.5rem',
                        padding: '0.15rem 0.4rem',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        backgroundColor: '#003340',
                        color: 'white',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease-in-out',
                        transform: copied ? 'translateX(1rem)' : 'translateX(0)',
                        boxShadow: copied ? '0 0 0 0.25rem rgba(0, 0, 0, 0.1)' : 'none',
                    }}
                >
                    {copied ? 'Copied!' : 'Copy code'}
                </button>
            </div>
            <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                customStyle={{
                    margin: 0,
                    borderRadius: '0 0 0.375rem 0.375rem',
                }}
            >
                {value}
            </SyntaxHighlighter>
        </div>
    );
};
