import React, { useState, useRef} from 'react';

interface SideBarTaskProps {
    title: string;
    id: number;
    column: number;
    setActive: (active: any) => void;
    setActiveCol: (activeCol: any) => void;
}

const SideBarTask = ({ title, id, column, setActive, setActiveCol}: SideBarTaskProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const dragImageRef = useRef<HTMLDivElement>(null);
    const originalCardRef = useRef<HTMLDivElement>(null);

    const handleDragStart = (e: React.DragEvent) => {
        setActive(id);
        setActiveCol(column);
        setIsDragging(true);

        // Hide the default drag image
        e.dataTransfer.setDragImage(new Image(), 0, 0);
        // Hide the original card after a short delay
        const timeoutId = setTimeout(() => {
            if (originalCardRef.current) {
                originalCardRef.current.style.display = 'none';
            }
        }, 0);

        // Adjust drag image styling for a realistic effect
        if (dragImageRef.current && originalCardRef.current) {
            dragImageRef.current.style.width = `${originalCardRef.current.offsetWidth}px`;
            dragImageRef.current.style.visibility = 'visible';
        }

        // Cleanup timeout on drag end
        return () => clearTimeout(timeoutId);
    };

    const handleDragEnd = () => {
        setActive(null);
        setActiveCol(null);
        setIsDragging(false);
        dragImageRef.current?.classList.remove('curser-grabbing');
        if (originalCardRef.current) {
            originalCardRef.current.style.display = 'flex'; // Show original card again
        }
        if (dragImageRef.current) {
            dragImageRef.current.style.visibility = 'hidden';
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        // Follow mouse coordinates during dragging
        if (dragImageRef.current) {
            dragImageRef.current.style.top = `${e.clientY}px`;
            dragImageRef.current.style.left = `${e.clientX}px`;
            dragImageRef.current.style.cursor = 'grabbing';
        }
    };

    return (
        <>
            {/* Custom drag image that follows the cursor */}
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

            {/* Original draggable card */}
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
