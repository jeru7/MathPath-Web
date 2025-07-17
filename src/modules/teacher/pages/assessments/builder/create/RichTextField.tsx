import { type ReactElement } from "react";
import { useEditor, EditorContent, Extensions } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import {
  FaAlignCenter,
  FaAlignLeft,
  FaAlignRight,
  FaBold,
} from "react-icons/fa";
import { FaItalic } from "react-icons/fa";
import { FaUnderline } from "react-icons/fa";
import { sanitizeHtml } from "../../utils/sanitizeHtml";

type RichTextFieldProps = {
  value: string;
  onContentChange?: (content: string) => void;
  extensions?: Extensions;
};

export default function RichTextField({
  onContentChange,
  extensions,
  value,
}: RichTextFieldProps): ReactElement {
  // TODO: fix initial load while on edit
  const editor = useEditor({
    extensions: extensions ?? [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value ?? "",
    // initial value
    onCreate({ editor }) {
      console.log("Value: ", value);
      // set align left on initial load
      editor.chain().focus().setTextAlign("left").run();
    },
    onUpdate: ({ editor }) => {
      const text = editor.state.doc.textContent.trim();
      const isEmpty = text.length === 0 || text === "";
      onContentChange?.(isEmpty ? "" : sanitizeHtml(editor.getHTML()));
    },
    editorProps: {
      // fix paste issue
      handlePaste(view, event) {
        const text = event.clipboardData?.getData("text/plain") ?? "";
        const rawText = text.replace(/\n/g, " ");
        const { tr } = view.state;
        tr.insertText(rawText);
        view.dispatch(tr);
        event.preventDefault();
        return true;
      },
    },
  });

  if (!editor) return <div>Loading...</div>;

  return (
    <section className="h-fit max-h-[150px] w-full border border-gray-300 rounded-sm flex flex-col bg-white">
      <div className="flex gap-2 p-1 justify-end bg-gray-100 rounded-t-xs border-b border-b-gray-300 h-[40px] items-center px-2">
        {/* left align */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className="border border-gray-500 rounded w-6 h-6 flex items-center justify-center hover:bg-gray-200"
          style={{
            backgroundColor: editor.isActive({ textAlign: "left" })
              ? "#CBD5E1"
              : "",
          }}
        >
          <FaAlignLeft />
        </button>
        {/* center align */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className="border border-gray-500 rounded w-6 h-6 flex items-center justify-center hover:bg-gray-200"
          style={{
            backgroundColor: editor.isActive({ textAlign: "center" })
              ? "#CBD5E1"
              : "",
          }}
        >
          <FaAlignCenter />
        </button>
        {/* right align */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className="border border-gray-500 rounded w-6 h-6 flex items-center justify-center hover:bg-gray-200"
          style={{
            backgroundColor: editor.isActive({ textAlign: "right" })
              ? "#CBD5E1"
              : "",
          }}
        >
          <FaAlignRight />
        </button>
        {/* bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="border border-gray-500 rounded text-sm w-6 h-6 flex items-center justify-center hover:cursor-pointer hover:bg-gray-200 transition-colors duration-200"
          style={{
            backgroundColor: editor.isActive("bold") ? "#CBD5E1" : "",
          }}
        >
          <FaBold />
        </button>
        {/* italize */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="border border-gray-500 rounded text-sm  w-6 h-6 flex items-center justify-center hover:cursor-pointer hover:bg-gray-200 transition-colors duration-200"
          style={{
            backgroundColor: editor.isActive("italic") ? "#CBD5E1" : "",
          }}
        >
          <FaItalic />
        </button>
        {/* underline */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className="border border-gray-500 rounded text-sm  w-6 h-6 flex items-center justify-center hover:cursor-pointer hover:bg-gray-200 transition-colors duration-200"
          style={{
            backgroundColor: editor.isActive("underline") ? "#CBD5E1" : "",
          }}
        >
          <FaUnderline />
        </button>
      </div>

      <div className="h-fit w-full max-h-[300px] overflow-y-auto p-2 max-w-[620px]">
        <EditorContent
          editor={editor}
          className="h-full w-full max-w-full break-words whitespace-pre-wrap"
          style={{ outline: "none" }}
        />
      </div>
    </section>
  );
}
