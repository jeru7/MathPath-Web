import { useEffect, type ReactElement } from "react";
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
import { sanitizeHtml } from "../utils/sanitizeHtml";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type RichTextFieldProps = {
  value: string;
  onContentChange?: (content: string) => void;
  extensions?: Extensions;
  classes?: string;
};

export default function RichTextField({
  onContentChange,
  extensions,
  value,
  classes,
}: RichTextFieldProps): ReactElement {
  const editor = useEditor({
    extensions: extensions ?? [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value ?? "",
    onCreate({ editor }) {
      editor.commands.setTextAlign("left");
      editor.commands.focus("end");
    },
    onUpdate: ({ editor }) => {
      const text = editor.state.doc.textContent.trim();
      const isEmpty = text.length === 0 || text === "";
      onContentChange?.(isEmpty ? "" : sanitizeHtml(editor.getHTML()));
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[80px] w-full",
          "p-3 text-foreground bg-background break-words whitespace-pre-wrap",
        ),
      },
    },
  });

  // resets value/content on changing type
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div
        className={cn(
          "w-full border rounded-md flex flex-col overflow-hidden",
          classes,
        )}
      >
        <Skeleton className="h-10 w-full rounded-none" />
        <Skeleton className="h-32 w-full rounded-none" />
      </div>
    );
  }

  return (
    <section
      className={cn(
        "w-full border rounded-md flex flex-col bg-background overflow-hidden",
        "border-border transition-colors duration-200",
        classes,
      )}
    >
      {/* toolbar */}
      <div className="flex gap-1 p-2 justify-end bg-muted border-b border-border h-10 items-center">
        {/* text alignment */}
        <div className="flex gap-1 mr-2">
          <Button
            type="button"
            variant={
              editor.isActive({ textAlign: "left" }) ? "default" : "outline"
            }
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className="h-7 w-7 p-0"
          >
            <FaAlignLeft className="w-3 h-3" />
          </Button>
          <Button
            type="button"
            variant={
              editor.isActive({ textAlign: "center" }) ? "default" : "outline"
            }
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className="h-7 w-7 p-0"
          >
            <FaAlignCenter className="w-3 h-3" />
          </Button>
          <Button
            type="button"
            variant={
              editor.isActive({ textAlign: "right" }) ? "default" : "outline"
            }
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className="h-7 w-7 p-0"
          >
            <FaAlignRight className="w-3 h-3" />
          </Button>
        </div>

        {/* text formatting */}
        <div className="flex gap-1">
          <Button
            type="button"
            variant={editor.isActive("bold") ? "default" : "outline"}
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className="h-7 w-7 p-0"
          >
            <FaBold className="w-3 h-3" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive("italic") ? "default" : "outline"}
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className="h-7 w-7 p-0"
          >
            <FaItalic className="w-3 h-3" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive("underline") ? "default" : "outline"}
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className="h-7 w-7 p-0"
          >
            <FaUnderline className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 w-full overflow-y-auto">
        <EditorContent
          editor={editor}
          className="h-full w-full max-w-full break-all whitespace-normal min-h-[80px] focus:outline-none"
        />
      </div>
    </section>
  );
}
