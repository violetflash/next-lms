"use client";

import dynamic from 'next/dynamic';
import "react-quill/dist/quill.snow.css";
import { } from 'react-quill'
import { useMemo } from 'react'; // ES6

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const Editor = ({
  value,
  onChange,
}: EditorProps) => {
  // use client is not enough to disable SSR, because it runs on a server once ant then (second time) on the client
  // to avoid hydration issues we need to do something like this
  const ReactQuill = useMemo(() => {
    return dynamic(() => import("react-quill"), { ssr: false });
  }, []);

  return (
    <div className="bg-white">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
      />
    </div>
  )
};