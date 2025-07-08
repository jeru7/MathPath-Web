import { useEffect, type ReactElement } from "react";
import { useEditor, EditorContent, Extensions } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { FaBold } from "react-icons/fa";
import { FaItalic } from "react-icons/fa";
import { FaUnderline } from "react-icons/fa";
import { AssessmentQuestion } from "../../../../../../core/types/assessment/assessment.types";

type RichTextFieldProps = {
  questionData: AssessmentQuestion;
  onContentChange?: (content: string) => void;
  extensions?: Extensions;
};

export default function RichTextField({
  questionData,
  onContentChange,
  extensions,
}: RichTextFieldProps): ReactElement {
  const editor = useEditor({
    extensions: extensions ?? [StarterKit, Underline],
    content: "",
    onUpdate: ({ editor }) => {
      onContentChange?.(editor.getText());
    },
  });

  if (!editor) return <div>Loading...</div>;

  return (
    <section className="h-fit max-h-[150px] w-full border border-gray-300 rounded-sm flex flex-col bg-white">
      <div className="flex gap-2 p-1 justify-end bg-gray-100 rounded-t-xs border-b border-b-gray-300 h-[40px] items-center px-2">
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
          className="h-full w-full"
          style={{ outline: "none" }}
        />
      </div>
    </section>
  );
}
