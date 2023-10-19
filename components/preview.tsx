"use client";

import dynamic from 'next/dynamic';
import "react-quill/dist/quill.snow.css";
import { useMemo } from 'react'; // ES6

interface PreviewProps {
  value: string;
}

export const Preview = ({ value }: PreviewProps) => {

  // use client is not enough to disable SSR, because it runs on a server once ant then (second time) on the client
  // to avoid hydration issues we need to do something like this
  const ReactQuill = useMemo(() => {
    return dynamic(() => import("react-quill"), { ssr: false });
  }, []);

  return (
    <div>
      <ReactQuill
        theme="bubble"
        value={value}
        readOnly
      />
    </div>
  )
}