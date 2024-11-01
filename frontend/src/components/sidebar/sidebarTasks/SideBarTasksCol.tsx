import React ,{ useRef } from 'react'
import SideBarTask from './SideBarTask';
import gsap from 'gsap';
import { motion } from 'framer-motion';

interface hash {
    id: number;
    title: string;
}

interface SideBarTasksProps {
    sideBarCol: { id: number; title: string; hashes: hash[] };
    setActive: (id: number) => void;
    onDrop: (colId: number, hashId: number) => void;
    setActiveCol: (colId: number) => void;
}

const SideBarTasks: React.FC<SideBarTasksProps> = ({ sideBarCol, setActive, onDrop, setActiveCol }) => {

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

    const downArrow = useRef<HTMLImageElement>(null)
    const userBody = useRef<HTMLDivElement>(null)
    const sideDown = () => {

        const isHidden = userBody.current?.classList.toggle('hidden');

        gsap.to(downArrow.current, {
            rotate: isHidden ? -90 : 0,
            duration: 0.3
        });
    }
    return (
        <>
            <motion.div className="user-header flex items-center justify-between p-1 pb-2 rounded-md hover:cursor-pointer hover:bg-[#F2EFED] mt-3">
                <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-md bg-black"></div>
                    <h1 className="font-[450] whitespace-nowrap overflow-hidden text-ellipsis select-none">{sideBarCol.title}</h1>
                </div>
                <div className="flex justify-center items-center gap-2">
                    <button className="p-1 "><svg width="13" height="13"> <path fill="currentColor" fill-rule="evenodd" d="M6 6V.5a.5.5 0 0 1 1 0V6h5.5a.5.5 0 1 1 0 1H7v5.5a.5.5 0 1 1-1 0V7H.5a.5.5 0 0 1 0-1H6z"></path></svg></button>
                    <button className="p-1" onClick={sideDown}><img src="chevron-down.svg" alt="" className="w-4 user-down-arrow" ref={downArrow} /></button>
                </div>
            </motion.div>
            <div className="user-body" ref={userBody} onDragOver={handleDragOver}>
                <DropIndicator onDrop={()=>onDrop(sideBarCol.id,0)}/>
                    {
                        sideBarCol.hashes.map((hash: hash) => (
                            <React.Fragment key={hash.id}>
                            <SideBarTask title={hash.title} id={hash.id} column={sideBarCol.id} setActive={setActive} setActiveCol={setActiveCol}/> 
                            <DropIndicator onDrop={()=>onDrop(sideBarCol.id,hash.id+1)}/>
                            </React.Fragment>
                            )
                        )
                    }
            </div>
        </>
    )
}

export const DropIndicator = ({ onDrop }: { onDrop: () => void }) => {
    const [show, setShow] = React.useState(false);
    return(
        <div onDragEnter={()=> setShow(true)} onDragLeave={()=> setShow(false)}  
        onDrop={()=> {onDrop(); setShow(false)}}
        onDragOver={(e)=> e.preventDefault()}
        className={`h-7 w-full bg-gray-400/15 border-t-2 border-t-[#DC4C3E] ${show ? "opacity-100" : "h-0.5 opacity-0"} transition-all duration-300`} />
    )
}


export default SideBarTasks