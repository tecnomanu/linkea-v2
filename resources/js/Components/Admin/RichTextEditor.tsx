import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Code,
    Heading1,
    Heading2,
    Heading3,
    Image as ImageIcon,
    Italic,
    Link as LinkIcon,
    List,
    ListOrdered,
    Quote,
    Redo,
    Strikethrough,
    Underline as UnderlineIcon,
    Undo,
} from "lucide-react";
import React, { useEffect } from "react";

interface RichTextEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

const MenuButton = ({
    onClick,
    active = false,
    disabled = false,
    children,
    title,
}: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
}) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`p-1.5 rounded transition-colors ${
            active
                ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                : "hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400"
        } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
    >
        {children}
    </button>
);

const MenuBar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) return null;

    const addLink = () => {
        const url = window.prompt("URL del enlace:");
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const addImage = () => {
        const url = window.prompt("URL de la imagen:");
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 rounded-t-lg">
            {/* History */}
            <MenuButton
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                title="Deshacer"
            >
                <Undo size={16} />
            </MenuButton>
            <MenuButton
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                title="Rehacer"
            >
                <Redo size={16} />
            </MenuButton>

            <div className="w-px h-5 bg-neutral-300 dark:bg-neutral-600 mx-1" />

            {/* Text formatting */}
            <MenuButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                active={editor.isActive("bold")}
                title="Negrita"
            >
                <Bold size={16} />
            </MenuButton>
            <MenuButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                active={editor.isActive("italic")}
                title="Cursiva"
            >
                <Italic size={16} />
            </MenuButton>
            <MenuButton
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                active={editor.isActive("underline")}
                title="Subrayado"
            >
                <UnderlineIcon size={16} />
            </MenuButton>
            <MenuButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                active={editor.isActive("strike")}
                title="Tachado"
            >
                <Strikethrough size={16} />
            </MenuButton>
            <MenuButton
                onClick={() => editor.chain().focus().toggleCode().run()}
                active={editor.isActive("code")}
                title="Codigo"
            >
                <Code size={16} />
            </MenuButton>

            <div className="w-px h-5 bg-neutral-300 dark:bg-neutral-600 mx-1" />

            {/* Headings */}
            <MenuButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                active={editor.isActive("heading", { level: 1 })}
                title="Titulo 1"
            >
                <Heading1 size={16} />
            </MenuButton>
            <MenuButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                active={editor.isActive("heading", { level: 2 })}
                title="Titulo 2"
            >
                <Heading2 size={16} />
            </MenuButton>
            <MenuButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                active={editor.isActive("heading", { level: 3 })}
                title="Titulo 3"
            >
                <Heading3 size={16} />
            </MenuButton>

            <div className="w-px h-5 bg-neutral-300 dark:bg-neutral-600 mx-1" />

            {/* Alignment */}
            <MenuButton
                onClick={() => editor.chain().focus().setTextAlign("left").run()}
                active={editor.isActive({ textAlign: "left" })}
                title="Alinear izquierda"
            >
                <AlignLeft size={16} />
            </MenuButton>
            <MenuButton
                onClick={() => editor.chain().focus().setTextAlign("center").run()}
                active={editor.isActive({ textAlign: "center" })}
                title="Centrar"
            >
                <AlignCenter size={16} />
            </MenuButton>
            <MenuButton
                onClick={() => editor.chain().focus().setTextAlign("right").run()}
                active={editor.isActive({ textAlign: "right" })}
                title="Alinear derecha"
            >
                <AlignRight size={16} />
            </MenuButton>

            <div className="w-px h-5 bg-neutral-300 dark:bg-neutral-600 mx-1" />

            {/* Lists */}
            <MenuButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                active={editor.isActive("bulletList")}
                title="Lista"
            >
                <List size={16} />
            </MenuButton>
            <MenuButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                active={editor.isActive("orderedList")}
                title="Lista numerada"
            >
                <ListOrdered size={16} />
            </MenuButton>
            <MenuButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                active={editor.isActive("blockquote")}
                title="Cita"
            >
                <Quote size={16} />
            </MenuButton>

            <div className="w-px h-5 bg-neutral-300 dark:bg-neutral-600 mx-1" />

            {/* Link & Image */}
            <MenuButton
                onClick={addLink}
                active={editor.isActive("link")}
                title="Agregar enlace"
            >
                <LinkIcon size={16} />
            </MenuButton>
            <MenuButton onClick={addImage} title="Agregar imagen">
                <ImageIcon size={16} />
            </MenuButton>
        </div>
    );
};

export function RichTextEditor({ content, onChange, placeholder = "Escribe aqui..." }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-red-500 underline",
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: "max-w-full h-auto rounded",
                },
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[300px] p-4",
            },
        },
    });

    // Sync external content changes
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    return (
        <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden bg-white dark:bg-neutral-900">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}

