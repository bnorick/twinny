import { VSCodeButton } from '@vscode/webview-ui-toolkit/react'
import { ReactNode } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism'

import { BOT_NAME, MESSAGE_NAME } from '../constants'

import styles from './index.module.css'
import { LanguageType, Theme, ThemeType } from '../extension/types'
import { getLanguageMatch } from './utils'

interface CodeBlockProps {
  className?: string
  children?: ReactNode
  language: LanguageType | undefined
  theme: ThemeType
  role: string | undefined
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const global = globalThis as any

export const CodeBlock = (props: CodeBlockProps) => {
  const { children, language, className, theme, role } = props

  const lang = getLanguageMatch(language, className)

  const handleCopy = () => {
    const text = String(children).replace(/^\n/, '')
    navigator.clipboard.writeText(text)
  }

  const handleNewDocument = () => {
    global.vscode.postMessage({
      type: MESSAGE_NAME.twinnyNewDocument,
      data: String(children).replace(/^\n/, '')
    })
  }

  const handleAccept = () => {
    global.vscode.postMessage({
      type: MESSAGE_NAME.twinnyAcceptSolution,
      data: String(children).replace(/^\n/, '')
    })
  }

  return (
    <>
      <SyntaxHighlighter
        children={String(children).trimStart().replace(/\n$/, '')}
        style={theme === Theme.Dark ? vscDarkPlus : vs}
        language={lang || 'auto'}
      />
      {role === BOT_NAME && (
        <>
          <div className={styles.codeOptions}>
            <VSCodeButton
              title="Accept solution"
              onClick={handleAccept}
              appearance="icon"
            >
              <span className="codicon codicon-check"></span>
            </VSCodeButton>
            <VSCodeButton
              title="Copy code"
              onClick={handleCopy}
              appearance="icon"
            >
              <span className="codicon codicon-copy"></span>
            </VSCodeButton>
            <VSCodeButton
              title="Append to new document"
              onClick={handleNewDocument}
              appearance="icon"
            >
              <span className="codicon codicon-new-file"></span>
            </VSCodeButton>
          </div>
        </>
      )}
    </>
  )
}

export default CodeBlock
