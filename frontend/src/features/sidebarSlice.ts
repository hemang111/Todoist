import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Task {
    title: string;
    id: number;
}

interface SideBarColumn {
    title: string;
    id: number;
    hashes: Task[];
}

interface SideBarState {
    sideBarCols: SideBarColumn[];
    active: number | null;
    activeCol: number | null;
}

const initialState: SideBarState = {
    sideBarCols: [
        { title: 'My Projects', id: 1, hashes: [{ title: 'My Works', id: 1 }, { title: 'Education', id: 2 }, { title: 'Home', id: 3 }] },
        { title: 'Ninja', id: 2, hashes: [{ title: 'My Works 2', id: 1 }, { title: 'Education 2', id: 2 }, { title: 'Home 2', id: 3 }] }
    ],
    active: null,
    activeCol: null,
};

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        setActive: (state, action: PayloadAction<number | null>) => {
            state.active = action.payload;
        },
        setActiveCol: (state, action: PayloadAction<number | null>) => {
            state.activeCol = action.payload;
        },
        setSideBarCols: (state, action: PayloadAction<SideBarColumn[]>) => {
            state.sideBarCols = action.payload;
        },
        onDrop: (state, action: PayloadAction<{ targetColumn: number; targetId: number }>) => {
            const { targetColumn, targetId } = action.payload;
            const { active, activeCol, sideBarCols } = state;

            if (active === null || activeCol === null) return;

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

            state.sideBarCols = updatedCols;
            state.active = null;
            state.activeCol = null;
        },
    },
});

export const { setActive, setActiveCol, setSideBarCols, onDrop } = sidebarSlice.actions;
export default sidebarSlice.reducer;
