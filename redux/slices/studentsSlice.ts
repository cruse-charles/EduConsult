import { db } from "@/lib/firebaseConfig";
import { Student } from "@/lib/types/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { doc, DocumentData, DocumentReference, getDoc } from "firebase/firestore";

// Function to fetch students for the current consultant user
export const fetchStudents = createAsyncThunk("consultantDashboard/fetchStudents",
  async (userId:string, {rejectWithValue}) => {
    try {
        // Get the consultant's document reference and snapshot
        const ref = doc(db, "consultantUsers", userId);    
        const consultantDocSnap = await getDoc(ref);
        
        // Extract student references from the consultant document
        const consultantData = consultantDocSnap.data();
        if (!consultantData) {
          throw new Error("No Consultant Data Found")
        }
        
        const studentRefs = consultantData.students || [];

        // Fetch each student's document data, evaluate each document
        const studentDocs = await Promise.all(
            studentRefs.map(async (studentRef: DocumentReference<DocumentData>) => {
              try {
                console.log("studentRef:", studentRef);
                const studentDocSnap = await getDoc(studentRef);
                if (studentDocSnap.exists()) {
                  return { id: studentDocSnap.id, ...studentDocSnap.data() }
                } else {
                  console.log('Student doc does not exist', studentRef.path)
                  return null
                }
              } catch (error) {
                console.log('Error fetching student doc:', studentRef.path, error);
                return null;
              }
            })
        );
      return studentDocs
    } catch (error) {
      console.log("Error fetching students:", error);
      return  []
    }
  }
) 

// const initialState: Student[] = []
interface StudentsState {
  studentList: Student[];
  loading: boolean;
  error: string | null;
}
const initialState: StudentsState = {studentList: [], loading: true, error: null};

// Create a slice for assignments
const studentsSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    setStudents(state, action) {
    //   state.students = action.payload;
        // return action.payload
        state.studentList = action.payload
        return state
    },
    addStudent(state, action) {
        // state.push(action.payload);
        state.studentList.push(action.payload);
        return state;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.studentList = action.payload || [];
        // return action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch students";
        console.error("fetchAssignments rejected:", action.payload);
        // return state;
      });
  },
});
export const { setStudents, addStudent } = studentsSlice.actions;
export default studentsSlice.reducer;