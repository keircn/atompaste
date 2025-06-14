export const PROGRAMMING_LANGUAGES = [
    { value: 'auto', label: 'Auto-detect' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'c', label: 'C' },
    { value: 'csharp', label: 'C#' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'swift', label: 'Swift' },
    { value: 'kotlin', label: 'Kotlin' },
    { value: 'scala', label: 'Scala' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'scss', label: 'SCSS' },
    { value: 'json', label: 'JSON' },
    { value: 'xml', label: 'XML' },
    { value: 'yaml', label: 'YAML' },
    { value: 'markdown', label: 'Markdown' },
    { value: 'sql', label: 'SQL' },
    { value: 'bash', label: 'Bash' },
    { value: 'powershell', label: 'PowerShell' },
    { value: 'dockerfile', label: 'Dockerfile' },
    { value: 'plaintext', label: 'Plain Text' },
] as const;

export function detectLanguage(content: string, filename?: string): string {
    if (!content) return '';

    if (filename) {
        const ext = filename.split('.').pop()?.toLowerCase();
        switch (ext) {
            case 'js': return 'javascript';
            case 'ts': return 'typescript';
            case 'tsx': return 'typescript';
            case 'jsx': return 'javascript';
            case 'py': return 'python';
            case 'java': return 'java';
            case 'cpp': case 'cc': case 'cxx': return 'cpp';
            case 'c': return 'c';
            case 'cs': return 'csharp';
            case 'php': return 'php';
            case 'rb': return 'ruby';
            case 'go': return 'go';
            case 'rs': return 'rust';
            case 'swift': return 'swift';
            case 'kt': return 'kotlin';
            case 'scala': return 'scala';
            case 'html': case 'htm': return 'html';
            case 'css': return 'css';
            case 'scss': case 'sass': return 'scss';
            case 'json': return 'json';
            case 'xml': return 'xml';
            case 'yml': case 'yaml': return 'yaml';
            case 'md': case 'markdown': return 'markdown';
            case 'sql': return 'sql';
            case 'sh': case 'bash': return 'bash';
            case 'ps1': return 'powershell';
        }
    }

    const firstLine = content.split('\n')[0].toLowerCase();
    const contentLower = content.toLowerCase();

    if (firstLine.startsWith('#!')) {
        if (firstLine.includes('python')) return 'python';
        if (firstLine.includes('node') || firstLine.includes('nodejs')) return 'javascript';
        if (firstLine.includes('bash') || firstLine.includes('sh')) return 'bash';
        if (firstLine.includes('ruby')) return 'ruby';
        if (firstLine.includes('php')) return 'php';
    }

    if ((content.trim().startsWith('{') && content.trim().endsWith('}')) ||
            (content.trim().startsWith('[') && content.trim().endsWith(']'))) {
        try {
            JSON.parse(content);
            return 'json';
        } catch {
        }
    }

    if (content.includes('<!DOCTYPE html') || 
            content.includes('<html') || 
            (content.includes('<') && content.includes('>'))) {
        return 'html';
    }

    if (content.includes('{') && content.includes('}') && 
            (content.includes(':') || content.includes(';'))) {
        if (contentLower.includes('@media') || 
                contentLower.includes('selector') ||
                /\.[a-z-]+\s*{/.test(content)) {
            return 'css';
        }
    }

    if (firstLine.startsWith('FROM ') || contentLower.includes('dockerfile')) {
        return 'dockerfile';
    }

    if (content.includes('---') || 
            /^[a-z_]+:\s/m.test(content) ||
            /^\s*-\s+/m.test(content)) {
        return 'yaml';
    }

    if (/\b(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\b/i.test(content)) {
        return 'sql';
    }

    if (contentLower.includes('def ') || 
            contentLower.includes('import ') ||
            contentLower.includes('from ') ||
            content.includes('__name__') ||
            /^\s*#.*python/i.test(content)) {
        return 'python';
    }

    if (content.includes('function ') || 
            content.includes('=>') ||
            content.includes('const ') ||
            content.includes('let ') ||
            content.includes('var ') ||
            content.includes('console.log') ||
            content.includes('require(') ||
            content.includes('import ')) {
        if (content.includes(': ') && 
                (content.includes('interface ') || content.includes('type '))) {
            return 'typescript';
        }
        return 'javascript';
    }

    if (content.includes('public class ') || 
            content.includes('public static void main') ||
            content.includes('System.out.print')) {
        return 'java';
    }

    if (content.includes('#include') || 
            content.includes('int main(') ||
            content.includes('printf(') ||
            content.includes('std::')) {
        if (content.includes('std::') || content.includes('namespace ')) {
            return 'cpp';
        }
        return 'c';
    }

    if (content.includes('<?php') || 
            content.includes('<?=') ||
            content.includes('$_GET') ||
            content.includes('$_POST')) {
        return 'php';
    }

    if (content.includes('end') && 
            (content.includes('def ') || content.includes('class ') || content.includes('require '))) {
        return 'ruby';
    }

    if (content.includes('package ') && 
            (content.includes('func ') || content.includes('import ('))) {
        return 'go';
    }

    if (content.includes('# ') || 
            content.includes('## ') ||
            content.includes('```') ||
            content.includes('](')) {
        return 'markdown';
    }

    if (content.includes('#!/bin/bash') ||
            content.includes('echo ') ||
            content.includes('export ') ||
            /\$[A-Z_]+/.test(content)) {
        return 'bash';
    }

    return 'plaintext';
}

export function getLanguageDisplayName(language: string): string {
    const lang = PROGRAMMING_LANGUAGES.find(l => l.value === language);
    return lang ? lang.label : language || 'Plain Text';
}

export function isValidLanguage(language: string): boolean {
    return PROGRAMMING_LANGUAGES.some(l => l.value === language);
}
