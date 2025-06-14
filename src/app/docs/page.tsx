'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '~/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { 
  Code, 
  Copy, 
  Check, 
  Key, 
  FileText, 
  Globe, 
  Lock,
  Book,
  Terminal,
  Zap
} from 'lucide-react';
import { pageVariants, containerVariants, itemVariants } from '~/lib/animations';

export default function ApiDocsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy code');
    }
  };

  const CodeBlock = ({ code, language = 'bash', id }: { code: string; language?: string; id: string }) => (
    <div className="relative">
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
        <code className="font-mono">{code}</code>
      </pre>
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2"
        onClick={() => copyCode(code, id)}
      >
        {copiedCode === id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      <Header 
        title="API Documentation"
        subtitle="Integrate atompaste into your workflow"
      />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial="initial"
          animate="animate"
          variants={containerVariants}
          className="max-w-4xl mx-auto space-y-8"
        >
          {/* Overview */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  API Overview
                </CardTitle>
                <CardDescription>
                  The atompaste API allows you to create, retrieve, update, and delete pastes programmatically.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Globe className="h-5 w-5 mx-2" />
                    <div>
                      <p className="font-medium">Base URL</p>
                      <p className="text-sm text-muted-foreground">https://atom.keiran.cc</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Zap className="h-5 w-5 mx-2" />
                    <div>
                      <p className="font-medium">Rate Limit</p>
                      <p className="text-sm text-muted-foreground">100 requests/minute</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Authentication */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Authentication
                </CardTitle>
                <CardDescription>
                  Use API keys to authenticate your requests. Generate keys in your account settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Include your API key in the Authorization header:</p>
                  <CodeBlock
                    code={`Authorization: Bearer atp_your_api_key_here`}
                    id="auth-header"
                  />
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    💡 <strong>Tip:</strong> API keys are required for creating, updating, and deleting pastes. 
                    Public pastes can be read without authentication.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Endpoints */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  API Endpoints
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Get Pastes */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">GET</Badge>
                    <code className="text-sm">/api/pastes</code>
                  </div>
                  <p className="text-sm text-muted-foreground">Retrieve a list of pastes with optional filtering.</p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Query Parameters:</p>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• <code>page</code> - Page number (default: 1)</li>
                      <li>• <code>limit</code> - Items per page (default: 10, max: 50)</li>
                      <li>• <code>search</code> - Search in title and content</li>
                      <li>• <code>language</code> - Filter by programming language</li>
                      <li>• <code>visibility</code> - Filter by visibility (public, private, all)</li>
                    </ul>
                  </div>
                  <CodeBlock
                    code={`curl -X GET "https://atom.keiran.cc/api/pastes?page=1&limit=10&search=javascript" \\
  -H "Authorization: Bearer atp_your_api_key_here"`}
                    id="get-pastes"
                  />
                </div>

                {/* Create Paste */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">POST</Badge>
                    <code className="text-sm">/api/pastes</code>
                  </div>
                  <p className="text-sm text-muted-foreground">Create a new paste.</p>
                  <CodeBlock
                    code={`curl -X POST "https://atom.keiran.cc/api/pastes" \\
  -H "Authorization: Bearer atp_your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "My Code Snippet",
    "content": "console.log('Hello, World!');",
    "language": "javascript",
    "isPublic": true
  }'`}
                    id="create-paste"
                  />
                </div>

                {/* Get Single Paste */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">GET</Badge>
                    <code className="text-sm">/api/pastes/:id</code>
                  </div>
                  <p className="text-sm text-muted-foreground">Retrieve a specific paste by ID.</p>
                  <CodeBlock
                    code={`curl -X GET "https://atom.keiran.cc/api/pastes/paste_id_here" \\
  -H "Authorization: Bearer atp_your_api_key_here"`}
                    id="get-paste"
                  />
                </div>

                {/* Update Paste */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">PUT</Badge>
                    <code className="text-sm">/api/pastes/:id</code>
                  </div>
                  <p className="text-sm text-muted-foreground">Update an existing paste (owner only).</p>
                  <CodeBlock
                    code={`curl -X PUT "https://atom.keiran.cc/api/pastes/paste_id_here" \\
  -H "Authorization: Bearer atp_your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Updated Title",
    "content": "Updated content here",
    "isPublic": false
  }'`}
                    id="update-paste"
                  />
                </div>

                {/* Delete Paste */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">DELETE</Badge>
                    <code className="text-sm">/api/pastes/:id</code>
                  </div>
                  <p className="text-sm text-muted-foreground">Delete a paste (owner only).</p>
                  <CodeBlock
                    code={`curl -X DELETE "https://atom.keiran.cc/api/pastes/paste_id_here" \\
  -H "Authorization: Bearer atp_your_api_key_here"`}
                    id="delete-paste"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Response Format */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Response Format
                </CardTitle>
                <CardDescription>
                  All API responses are in JSON format.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Successful Response:</p>
                  <CodeBlock
                    code={`{
  "paste": {
    "id": "clp1234567890",
    "title": "My Code Snippet",
    "content": "console.log('Hello, World!');",
    "language": "javascript",
    "isPublic": true,
    "createdAt": "2024-06-14T10:30:00.000Z",
    "updatedAt": "2024-06-14T10:30:00.000Z",
    "user": {
      "id": "user123",
      "username": "developer",
      "displayName": "John Doe"
    }
  }
}`}
                    language="json"
                    id="success-response"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Error Response:</p>
                  <CodeBlock
                    code={`{
  "error": "Paste not found",
  "code": 404
}`}
                    language="json"
                    id="error-response"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Supported Languages */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Supported Languages
                </CardTitle>
                <CardDescription>
                  Programming languages supported for syntax highlighting.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    'javascript', 'typescript', 'python', 'java', 'cpp', 'c', 'csharp', 'php',
                    'ruby', 'go', 'rust', 'swift', 'kotlin', 'scala', 'html', 'css',
                    'scss', 'json', 'xml', 'yaml', 'markdown', 'sql', 'bash', 'powershell'
                  ].map(lang => (
                    <Badge key={lang} variant="outline" className="justify-center">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Code Examples */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Code Examples</CardTitle>
                <CardDescription>
                  Example implementations in different programming languages.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">JavaScript/Node.js:</p>
                  <CodeBlock
                    code={`const response = await fetch('https://atom.keiran.cc/api/pastes', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer atp_your_api_key_here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'My API Paste',
    content: 'console.log("Created via API!");',
    language: 'javascript',
    isPublic: true
  })
});

const data = await response.json();
console.log('Paste created:', data.paste.id);`}
                    language="javascript"
                    id="js-example"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Python:</p>
                  <CodeBlock
                    code={`import requests

response = requests.post('https://atom.keiran.cc/api/pastes', 
    headers={
        'Authorization': 'Bearer atp_your_api_key_here',
        'Content-Type': 'application/json'
    },
    json={
        'title': 'My API Paste',
        'content': 'print("Created via API!")',
        'language': 'python',
        'isPublic': True
    }
)

data = response.json()
print(f"Paste created: {data['paste']['id']}")`}
                    language="python"
                    id="python-example"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </motion.div>
  );
}
