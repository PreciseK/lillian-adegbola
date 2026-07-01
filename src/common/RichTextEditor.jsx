import React, { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({ value, onChange, placeholder = 'Start writing...', height = 300 }) => {
  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean'],
    ],
  }), []);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'align',
    'list', 'bullet',
    'blockquote', 'code-block',
    'link', 'image',
  ];

  return (
    <div className="rich-text-editor">
      <style>{`
        .rich-text-editor .ql-container {
          font-family: 'Montserrat', sans-serif;
          font-size: 14px;
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
          border-color: #d1d5db;
          min-height: ${height}px;
        }
        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          border-color: #d1d5db;
          background: #f9fafb;
        }
        .rich-text-editor .ql-container:focus-within {
          border-color: #d4af37;
          box-shadow: 0 0 0 2px rgba(212,175,55,0.2);
        }
        .rich-text-editor .ql-editor {
          min-height: ${height}px;
          line-height: 1.7;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
      `}</style>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;
