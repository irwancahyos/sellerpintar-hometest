'use client';

// ******** Imports ********
import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import dynamic from 'next/dynamic';
import 'quill/dist/quill.snow.css';
import type QuillNamespace from 'quill';
import { Redo2, Undo2 } from 'lucide-react';
import { createRoot } from 'react-dom/client';
import "./quill.css";
import { QuillEditorComponentProps } from '@/types/types-and-interface';

// ******** Exports Declaration ********
export type RichTextEditorHandle = {
  getContent: () => string;
};

// ******** Component Declaration ********
const Editor = forwardRef<RichTextEditorHandle, QuillEditorComponentProps>((props, ref) => {

  // ******** Local variable declaration ********
  const [wordCount, setWordCount] = useState(0);
  const [isEditorReady, setIsEditorReady] = useState(false);

  // ******** Local variable declaration ********
  const { value, onChange, onBlur } = props;
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<QuillNamespace | null>(null);

  /**
   * Main function to load and config quill js
   */
  useEffect(() => {
    const loadQuill = async () => {
      const Quill = (await import('quill')).default;

      if (editorRef.current) {
        quillRef.current = new Quill(editorRef.current, {
          theme: 'snow',
          modules: {
            toolbar: {
              container: [
                ['bold', 'italic'],
                ['image'],
                [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
              ]
            },
            history: {
              delay: 1000,
              maxStack: 100,
              userOnly: true
            }
          },
          placeholder: 'Type a content...',
        });

        setIsEditorReady(true);

        const quill = quillRef.current;

        quill.on('selection-change', (range) => {
          if (range === null) {
            onBlur?.(); // panggil onBlur ketika blur
          }
        });

        // Set initial value
        if (value) {
          quill.root.innerHTML = value;
        }

        // Sync value to RHF
        quill.on('text-change', () => {
          const html = quill.root.innerHTML;
          const isEmpty = html === '<p><br></p>' || html.trim() === '';
          onChange(isEmpty ? '' : html);

          const text = quill.getText().trim();
          setWordCount(text ? text.split(/\s+/).length : 0);
        });

                // ✅ Trigger blur for RHF when focus is lost
        quill.root.addEventListener('focusout', () => {
          onBlur(); 
        });

        // Insert Undo & Redo buttons manually
        const toolbarContainer = editorRef.current.previousSibling as HTMLElement;

        const undoBtn = document.createElement('button');

        undoBtn.type = 'button';
        undoBtn.className = 'ql-undo';
        undoBtn.title = 'Undo';
        undoBtn.onclick = () => quill.history.undo();
        createRoot(undoBtn).render(<Undo2 size={16} />);
        const redoBtn = document.createElement('button');
        createRoot(redoBtn).render(<Redo2 size={16} />);
        redoBtn.type = 'button';
        redoBtn.className = 'ql-redo';
        redoBtn.title = 'Redo';
        redoBtn.onclick = () => quill.history.redo();

        // Insert at the beginning of the toolbar
        if (toolbarContainer) {
          toolbarContainer.insertBefore(undoBtn, toolbarContainer.firstChild);
          toolbarContainer.insertBefore(redoBtn, undoBtn.nextSibling);
        }

        // Word count update
        quill.on('text-change', () => {
          const text = quill.getText().trim();
          setWordCount(text ? text.split(/\s+/).length : 0);
        });
      }
    };

    loadQuill();

    return () => {
      quillRef.current = null;
    };
  }, []);

  /**
   * Update the value when props.value changes
   */
  useEffect(() => {
    const quill = quillRef.current;
    if (!quill || !isEditorReady) return;
  
    const editorEmpty = quill.getText().trim() === '';
    const valueChanged = value && value !== quill.root.innerHTML;
  
    if (editorEmpty && valueChanged) {
      quill.root.innerHTML = value;
    }
  }, [value, isEditorReady]);


  useImperativeHandle(ref, () => ({
    getContent: () => {
      return quillRef.current?.root.innerHTML || '';
    },
  }));

  return (
    <div className="rounded-md bg-white rounded-t-md">
      <div ref={editorRef} className="min-h-[200px] bg-gray-100 px-4 py-2" />
      <div className="footer-count text-sm h-[50px] text-gray-500">{wordCount} Words</div>
    </div>
  );
});

Editor.displayName = 'RichTextEditor';

const QuillEditorComponent = dynamic(() => Promise.resolve(Editor), {
  ssr: false,
});

// ******** Exports Declaration ********
export default QuillEditorComponent;
