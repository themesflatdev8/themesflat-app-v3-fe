"use client";
import React, { useState } from "react";
import { Page, Card, TextField, Button, Text } from "@shopify/polaris";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import axios from "@/utils/axios";

const DraggableItem = ({ id, label }: { id: string; label: string }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id });
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} 
         style={{ padding: 8, marginBottom: 8, border: '1px solid #ccc', cursor: 'grab' }}>
      {label}
    </div>
  );
};

const DropArea = ({ children }: { children: React.ReactNode }) => {
  const { setNodeRef, isOver } = useDroppable({ id: 'preview' });
  return (
    <div ref={setNodeRef} style={{
      minHeight: 300,
      border: '2px dashed #bbb',
      padding: 16,
      background: isOver ? '#e3fcef' : '#f6f6f7'
    }}>
      {children}
    </div>
  );
};

export default function ThemeBuilder() {
  const [sections, setSections] = useState<string[]>([]);
  const [html, setHtml] = useState('<div class="hello">Hello World</div>');
  const [css, setCss] = useState('.hello { color:red; font-weight:bold; }');

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over?.id === 'preview') setSections(prev => [...prev, active.id]);
  };

  const saveSection = async () => {
    const combined = `<style>${css}</style>${html}`;
    const payload = {
        content: combined,
        id: 'hello-section',
        shop: 'anv-theme-1.myshopify.com',
    };

    await axios.post("/save-section", payload, {
        headers: { "Content-Type": "application/json" },
    });
    alert('Saved!');
  };

  return (
    <Page title="Theme Builder">
      <Card >
        <DndContext onDragEnd={handleDragEnd}>
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 16 }}>
            <div>
              <Text variant="headingMd">Sections</Text>
              <DraggableItem id="hello" label="Hello Section" />
            </div>
            <DropArea>
              {sections.length === 0 ? 
                <Text color="subdued">Kéo section vào đây</Text> :
                <div dangerouslySetInnerHTML={{ __html: `<style>${css}</style>${html}` }} />
              }
            </DropArea>
          </div>
        </DndContext>

        <TextField label="HTML" multiline value={html} onChange={setHtml} />
        <TextField label="CSS" multiline value={css} onChange={setCss} style={{ marginTop: 12 }} />
        <Button primary onClick={saveSection} style={{ marginTop: 16 }}>Lưu section</Button>
      </Card>
    </Page>
  );
}
