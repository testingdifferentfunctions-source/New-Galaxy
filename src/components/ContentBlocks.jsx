import React, { useEffect, useRef } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-python";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-json";
import katex from "katex";
import "katex/dist/katex.min.css";

function LatexBlock({ formula }) {
  let html = "";
  try {
    html = katex.renderToString(formula || "", {
      displayMode: true,
      throwOnError: false,
    });
  } catch {
    html = `<code>${formula}</code>`;
  }
  return (
    <div
      className="my-6 rounded-lg p-5 overflow-x-auto"
      style={{ backgroundColor: "#222222", border: "1px solid #333333", color: "#E0E0E0" }}
    >
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

function Block({ block, index }) {
  const id = `block-${index}`;
  switch (block.type) {
    case "heading":
      return (
        <h2
          id={id}
          className="scroll-mt-24 text-2xl md:text-3xl font-bold tracking-tight text-white mt-8 mb-8"
        >
          {block.text}
        </h2>
      );
    case "subheading":
      return (
        <h3
          id={id}
          className="scroll-mt-24 text-xl font-semibold text-white mt-8 mb-6"
        >
          {block.text}
        </h3>
      );
    case "paragraph":
      return (
        <p className="text-[#C0C0C0] leading-relaxed mb-8 text-base">
          {block.text}
        </p>
      );
    case "code":
      return (
        <pre
          className="my-6 rounded-lg p-5 overflow-x-auto text-sm font-mono leading-relaxed"
          style={{ backgroundColor: "#222222", border: "1px solid #333333" }}
        >
          <code className={`language-${block.language || "python"}`}>
            {block.code || ""}
          </code>
        </pre>
      );
    case "list":
      return (
        <ul className="list-disc list-inside space-y-2 mb-8 text-[#C0C0C0] marker:text-[#A0A0A0]">
          {(block.items || []).map((item, i) => (
            <li key={i} className="leading-relaxed">{item}</li>
          ))}
        </ul>
      );
    case "latex":
      return <LatexBlock formula={block.formula} />;
    case "quote":
      return (
        <blockquote
          className="border-l-2 border-white pl-5 italic text-[#C0C0C0] my-6"
        >
          {block.text}
        </blockquote>
      );
    default:
      return null;
  }
}

export default function ContentBlocks({ blocks }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      Prism.highlightAllUnder(ref.current);
    }
  }, [blocks]);

  if (!blocks || blocks.length === 0) return null;

  return (
    <div ref={ref}>
      {blocks.map((block, i) => (
        <Block key={i} block={block} index={i} />
      ))}
    </div>
  );
}