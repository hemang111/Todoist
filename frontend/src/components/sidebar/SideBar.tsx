import { useState, useEffect } from "react";
import './sidebar.css'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SideBarTasks from "./sidebarTasks/SideBarTasksCol";

gsap.registerPlugin(useGSAP);

const SideBar = () => {

    const [width, setWidth] = useState(300);
    const [isResizing, setIsResizing] = useState(false);
    const [sideBarCols, setSideBarCols] = useState([{ title: 'My Projects', id: 1, hashes: [{ title: 'My Works', id: 1 ,isfav:true }, { title: 'Education', id: 2,isfav:false }, { title: 'Home', id: 3 , isfav: false }] }
        , { title: 'Ninja', id: 2, hashes: [{ title: 'My Works 2', id: 1,isfav:false  }, { title: 'Education 2', id: 2,isfav:false  }, { title: 'Home 2', id: 3,isfav:false }] }]);

    const [active, setActive] = useState<number | null>(null);
    const [activeCol, setActiveCol] = useState<number | null>(null);
    const onDrop = (targetColumn: number, targetId: number,isfav:boolean) => {
        if(isfav){
             console.log("Its fav");
             setActive(null);
             setActiveCol(null);
       }
       else{
        console.log(`${active} is going to be dropped from ${activeCol} in ${targetColumn} at the position ${targetId}`);
        document.body.style.cursor = ' default';
        if (active === null || active === undefined) {
            return;
        }
        if (activeCol === null || activeCol === undefined) {
            return;
        }
        const updatedCols = [...sideBarCols];

        const sourceColIndex = updatedCols.findIndex(col => col.id === activeCol);
        const targetColIndex = updatedCols.findIndex(col => col.id === targetColumn);

        if (sourceColIndex === -1 || targetColIndex === -1) return;

        const sourceCol = updatedCols[sourceColIndex];
        const taskIndex = sourceCol.hashes.findIndex(task => task.id === active);

        if (taskIndex === -1) return;

        const [removedTask] = sourceCol.hashes.splice(taskIndex, 1);

        const targetCol = updatedCols[targetColIndex];
        let targetPosition = targetCol.hashes.findIndex(task => task.id === targetId);
        if (targetId === 0) {
            targetPosition = 0;
        }

        if (targetPosition !== -1) {
            targetCol.hashes.splice(targetPosition, 0, removedTask);
        } else {
            targetCol.hashes.push(removedTask);
        }

        updatedCols.forEach(col => {
            col.hashes.forEach((task, index) => {
                task.id = index + 1;
            });
        });

        setSideBarCols(updatedCols);

        setActive(null);
        setActiveCol(null);
       }
    };


    const handleMouseDown = () => {
        setIsResizing(true);
        document.body.style.cursor = 'col-resize';
    };

    interface MouseMoveEvent extends MouseEvent {
        clientX: number;
    }

    const handleMouseMove = (e: MouseMoveEvent) => {
        if (isResizing && e.clientX > 240 && e.clientX < 440) {
            setWidth(e.clientX);

        }
    };

    const handleMouseUp = () => {
        if (isResizing) {
            setIsResizing(false);
            document.body.style.cursor = 'default';
        }
    };


    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    return (
        <>
            <div className="wrapper overflow-y-auto" style={{ width: `${width}px` }}>
                <div className="sidebar p-4 flex flex-col">
                    <div className="top flex items-center justify-between mb-3">
                        <div className="left-top flex items-center gap-3 hover:cursor-pointer w-fit p-1 rounded-md hover:bg-[#F2EFED]">
                            <div className="bg-black h-7 w-7 rounded-full"></div>
                            <div className="flex items-center gap-1">
                                <h1 className="font-medium whitespace-nowrap overflow-hidden text-ellipsis select-none">Girish</h1>
                                <img src="chevron-down.svg" alt="" className="w-5 text-gray-600" />
                            </div>
                        </div>
                        <div className="right-top flex items-center gap-2 h-8">
                            <button><img src="bell.svg" alt="" className="w-9 text-gray-600 hover:cursor-pointer p-2 rounded-md hover:bg-[#F2EFED]" /></button>
                            <button><img src="sidebar.svg" alt="" className="w-9 text-gray-600 hover:cursor-pointer p-2 rounded-md hover:bg-[#F2EFED]" /></button>
                        </div>
                    </div>
                    <div className="mytasks flex flex-col gap-1">
                        <div className="addTask flex items-center gap-2 p-1 rounded-md hover:cursor-pointer hover:bg-[#F2EFED] mb-1 ">
                            <img src="fill-plus.svg" alt="" />
                            <h1 className="text-[#DC4C3E] font-semibold select-none">Add Task</h1>
                        </div>
                        <div className="search flex items-center gap-2 p-1 rounded-md hover:cursor-pointer hover:bg-[#F2EFED]">
                            <img src="search.svg" alt="" />
                            <h1>Search</h1>
                        </div>
                        <div className="search flex items-center justify-between p-1 rounded-md hover:cursor-pointer hover:bg-[#F2EFED]">
                            <div className="flex gap-2">
                                <img src="inbox.svg" alt="" />
                                <h1>Inbox</h1>
                            </div>
                            <p className="text-sm pr-2">3</p>
                        </div>
                        <div className="search flex items-center justify-between p-1 rounded-md hover:cursor-pointer hover:bg-[#F2EFED]">
                            <div className="flex gap-2">
                                <svg width="24" height="24" viewBox="0 0 24 24">
                                    <g fill="currentColor" fill-rule="evenodd">
                                        <path fill-rule="nonzero"
                                            d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H6zm1 3h10a.5.5 0 1 1 0 1H7a.5.5 0 0 1 0-1z">
                                        </path><text
                                            font-family="-apple-system, system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'"
                                            font-size="9" transform="translate(4 2)" font-weight="500">
                                            <tspan x="8" y="15" text-anchor="middle">30</tspan>
                                        </text>
                                    </g>
                                </svg>
                                <h1>Today</h1>
                            </div>
                            <p className="text-[#DC4C3E] text-sm pr-2">5</p>
                        </div>
                        <div className="search flex items-center gap-2 p-1 rounded-md hover:cursor-pointer hover:bg-[#F2EFED]">
                            <img src="upcoming.svg" alt="" />
                            <h1>Upcoming</h1>
                        </div>
                        <div className="search flex items-center gap-2 p-1 rounded-md hover:cursor-pointer hover:bg-[#F2EFED]">
                            <img src="filter.svg" alt="" />
                            <h1>Filters & Labels</h1>
                        </div>
                        <div className="search flex items-center gap-2 p-1 rounded-md hover:cursor-pointer hover:bg-[#F2EFED]">
                            <img src="done.svg" alt="" />
                            <h1>Completed</h1>
                        </div>
                    </div>
                    <div className="myprojects">
                        <div className="user flex flex-col">
                            {
                                sideBarCols.map((sideBarCol) => (
                                    <SideBarTasks sideBarCol={sideBarCol} setActive={setActive} setActiveCol={setActiveCol} onDrop={onDrop} />
                                ))
                            }
                        </div>
                    </div>
                    <div
                        className="resizer"
                        onMouseDown={handleMouseDown}
                    />
                </div>
            </div>
        </>
    )
}

export default SideBar