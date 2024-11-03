import dynamic from "next/dynamic";

export const ReactMarkdown = dynamic<any>(() => import("react-markdown"));
