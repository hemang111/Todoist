import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setActive, setActiveCol } from '../../../features/sidebarSlice';
import { AppDispatch } from '../../../app/store';

interface SideBarTaskProps {
    title: string;
    id: number;
    column: number;
}

const SideBarTask: React.FC<SideBarTaskProps> = ({ title, id, column }) => {
    const [isDragging, setIsDragging] = useState(false);
    const dragImageRef = useRef<HTMLDivElement>(null);
    const originalCardRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch<AppDispatch>();

    const handleDragStart = (e: React.DragEvent) => {
        dispatch(setActive(id));
        dispatch(setActiveCol(column));
        setIsDragging(true);
        e.dataTransfer.setDragImage(new Image(), 0, 0);

        const timeoutId = setTimeout(() => {
            if (originalCardRef.current) {
                originalCardRef.current.style.display = 'none';
            }
        }, 0);

        if (dragImageRef.current && originalCardRef.current) {
            dragImageRef.current.style.width = `${originalCardRef.current.offsetWidth}px`;
            dragImageRef.current.style.visibility = 'visible';
        }

        return () => clearTimeout(timeoutId);
    };

    const handleDragEnd = () => {
        dispatch(setActive(null));
        dispatch(setActiveCol(null));
        setIsDragging(false);
        dragImageRef.current?.classList.remove('cursor-grabbing');
        if (originalCardRef.current) {
            originalCardRef.current.style.display = 'flex';
        }
        if (dragImageRef.current) {
            dragImageRef.current.style.visibility = 'hidden';
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        if (dragImageRef.current) {
            dragImageRef.current.style.top = `${e.clientY}px`;
            dragImageRef.current.style.left = `${e.clientX}px`;
            dragImageRef.current.style.cursor = 'grabbing';
        }
    };

    return (
        <>
            <div
                ref={dragImageRef}
                className="drag-image p-1 rounded-md opacity-70 bg-gray-200 pointer-events-none fixed"
                style={{
                    visibility: 'hidden',
                    cursor: 'grabbing',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    transform: 'translate(-50%, -50%)',
                }}
            >
                <div className="flex gap-2">
                    <img src="hash.svg" alt="" />
                    <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">{title}</h1>
                </div>
            </div>

            <div
                ref={originalCardRef}
                className={`draggedCard flex items-center justify-between p-1 rounded-md hover:cursor-pointer hover:bg-[#F2EFED] ${
                    isDragging ? 'cursor-grabbing' : 'cursor-pointer'
                }`}
                draggable="true"
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDrag={handleDrag}
            >
                <div className="flex gap-2">
                    <img src="hash.svg" alt="" />
                    <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">{title}</h1>
                </div>
                <p className="text-sm pr-2">3</p>
            </div>
        </>
    );
};

export default SideBarTask;