"use client";

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Chapter } from '@prisma/client';
import { Grip, Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from '@hello-pangea/dnd';

type ChapterUpdateData = Pick<Chapter, "id" | "position">;

type ChaptersListProps = {
  items: Chapter[];
  onEdit: (id: string) => void;
  onReorder: (orderData: ChapterUpdateData[]) => void;
}

export const ChaptersList = ({
  onEdit,
  onReorder,
  items
}: ChaptersListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>(items);

  // first render on server side will set this flag to true
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // items rehydration
    setChapters(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(chapters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // figure out which chapter is affected by this reorder
    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index)

    const updatedChapters = items.slice(startIndex, endIndex + 1);
    setChapters(items);

    const bulkUpdateData = updatedChapters.map((chapter) => ({
      id: chapter.id,
      position: items.findIndex((item) => item.id === chapter.id)
    }));

    onReorder(bulkUpdateData);
  }

  // "use client" component still run on the server side,
  // and then will be re-rendered on the client side.
  // So, we need to check if the component is already mounted on the server side.
  // hydration error is an error, when server side component and client side component
  // are not in sync (doesn't match).
  // So on the server side this component will not be displayed.
  if (!isMounted) {
    return null; // will fix hydration issues with drag and drop
  }

  return (
    <DragDropContext onDragEnd={onDragEnd} >
      <Droppable droppableId="chapters" direction="vertical">
        {(provided) => (
          <ul
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {chapters.map((chapter, index) => (
              <Draggable key={chapter.id} draggableId={chapter.id} index={index}>
                {(provided) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={cn(
                      'flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm',
                      chapter.is_published && 'border-sky-200 bg-sky-100 text-sky-700'
                    )}
                  >
                    <div
                      className={cn(
                        'px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition',
                        chapter.is_published && 'border-r-sky-200 hover:bg-sky-200'
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip
                        className="h-5 w-5"
                      />
                    </div>
                    {chapter.title}
                    <div
                      className="ml-auto pr-2 flex items-center gap-x-2"
                    >
                      {chapter.is_free && (
                        <Badge>Free</Badge>
                      )}
                      <Badge
                        className={cn(
                          'bg-slate-500',
                          chapter.is_published && 'bg-sky-700'
                        )}
                      >
                        {chapter.is_published ? "Published" : "Draft"}
                      </Badge>
                      <Pencil
                        onClick={() => onEdit(chapter.id)}
                        className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                      />
                    </div>
                    {/*<ChapterItem*/}
                    {/*  chapter={chapter}*/}
                    {/*  onEdit={onEdit}*/}
                    {/*/>*/}
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
}