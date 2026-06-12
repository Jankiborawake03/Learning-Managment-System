import { createContext, useState } from "react";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [currentEditedInstructorId, setCurrentEditedInstructorId,currentEditedStudentId, setCurrentEditedStudentId] = useState(null);

    return (
        <AdminContext.Provider value={{ currentEditedInstructorId, setCurrentEditedInstructorId,currentEditedStudentId, setCurrentEditedStudentId }}>
            {children}
        </AdminContext.Provider>
    );
};