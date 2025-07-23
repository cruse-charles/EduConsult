import { db } from "@/lib/firebaseConfig";
import { FirebaseUserInfo } from "@/lib/types/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { doc, DocumentData, DocumentReference, getDoc } from "firebase/firestore";

// Function to fetch students for the current consultant user
export const fetchStudents = createAsyncThunk(
    "consultantDashboard/fetchStudents",
    async (user: FirebaseUserInfo, {rejectWithValue}) => {
        try {
            // Get the consultant's document reference and snapshot
            const ref = doc(db, "consultantUsers", user.id);    
            const consultantDocSnap = await getDoc(ref);
    
            // Extract student references from the consultant document
            const consultantData = consultantDocSnap.data();
            if (!consultantData) throw Error

            const studentRefs = consultantData.students || [];
    
            // Fetch each student's document data
            const studentDocs = await Promise.all(
                studentRefs.map(async (studentRef: DocumentReference<DocumentData>) => {
                    const studentDocSnap = await getDoc(studentRef);
                    return studentDocSnap.exists()
                        ? { id: studentDocSnap.id, ...studentDocSnap.data() }
                        : null;
                })
            );

            console.log('studentDocs',studentDocs)
            return studentDocs
        } catch (error) {
            console.log("Error fetching students:", error);
        }
    }
) 

// const initialState = {
//   students: [],
//   loading: false,
//   error: null,
// };

const initialState = []

// Create a slice for assignments
const studentsSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    setStudents(state, action) {
    //   state.students = action.payload;
        return action.payload
    },
    addStudent(state, action) {
        state.push(action.payload);
        return state;
    }
  },
  extraReducers: (builder) => {
    builder
    //   .addCase(fetchStudents.pending, (state) => {
    //     // state.loading = true;
    //     // state.error = null;
    //   })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        // state.loading = false;
        // state.students = action.payload || [];
        return action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        // state.loading = false;
        // state.error = action.error.message || "Failed to fetch students";
            console.error("fetchAssignments rejected:", action.payload);
            return state;
      });
  },
});
export const { setStudents, addStudent } = studentsSlice.actions;
export default studentsSlice.reducer;