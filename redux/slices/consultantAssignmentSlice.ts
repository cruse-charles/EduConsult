import { db } from "@/lib/firebaseConfig";

import { startOfWeek, endOfWeek } from 'date-fns';

import { query, where, getDocs, collection, doc, orderBy, limit, getDoc } from 'firebase/firestore';
import { Timestamp } from "firebase/firestore";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { Assignment } from "@/lib/types/types";

// Async thunk to fetch assignments from Firestore by an array of IDs
export const fetchConsultantAssignments = createAsyncThunk(
  "consultantAssignments/fetchAssignments",
  async (assignmentsDocIds: string[], {rejectWithValue}) => {
    try {
      // Fetch all assignments in parallel
      const assignments = await Promise.all(
        assignmentsDocIds.map(async (assignmentDocId) => {
          // Get a reference to the assignment document and fetch its snapshot
          const assignmentRef = doc(db, "assignments", assignmentDocId);
          const assignmentSnapshot = await getDoc(assignmentRef);

          if (!assignmentSnapshot.exists()) {
            throw new Error(`Assignment with ID ${assignmentDocId} not found`);
          }

          // Extract data from the snapshot
          const data = assignmentSnapshot.data();
          
          // Ensure all required Assignment fields are present
          return {
            id: assignmentSnapshot.id,
            title: data?.title || '',
            type: data?.type || '',
            priority: data?.priority || '',
            dueDate: data?.dueDate || undefined,
            note: data?.note || '',
            createdAt: data?.createdAt || null,
            student: data?.student || '',
            folder: data?.folder || '',
            status: data?.status || '',
            timeline: data?.timeline || [],
            ...data,
          } as Assignment;
        })
      );
      return assignments;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchConsultantDashboardAssignments = createAsyncThunk(
  "consultantDashboard/fetchConsultantDashboardAssignments",
  async (consultantId: string) => {
    try {
      // Find today and six days later, encompasing a week
      // const today = new Date()
      // today.setDate(today.getDate())
      // const sixDaysLater = new Date()
      // sixDaysLater.setDate(today.getDate() + 6);

          // Find assignments from two last month, this month, and next month
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 2, 0); 
      
      // Count assignments with dueDates within current week
      const q = query(
          collection(db, 'assignments'),
          where('consultantId', '==', consultantId),
          // where('dueDate', '>=', Timestamp.fromDate(today)),
          // where('dueDate', '<=', Timestamp.fromDate(sixDaysLater)),
                    where('dueDate', '>=', Timestamp.fromDate(startDate)),
                    where('dueDate', '<=', Timestamp.fromDate(endDate)),

          // where('status', '==', 'In-Progress')
      )
      
      const snapshot = await getDocs(q);
      console.log('getTasksDueThisWeekConsultantDashboard', snapshot);
      return snapshot;
    } catch (error) {
      console.error("Error fetching consultant dashboard assignments:", error);
      throw error;
    }
  }
)

const initialState: Assignment[] = []

// Create a slice for assignments
const consultantAssignmentsSlice = createSlice({
  name: 'studentAssignments',
  initialState,
  reducers: {
    // Replaces state with a new list of assignments
    setAssignments(state, action) {
      return action.payload;
    },
    // Adds a new assignment to the state
    addAssignment(state, action) {
      return [...state, action.payload]
    },
    // Adds a new entry to the timeline of a specific assignment
    addEntry(state, action) {
      const { entryData, assignmentId } = action.payload;
      const assignmentIndex = state.findIndex(assignment => assignment.id === assignmentId);
      
      if (assignmentIndex !== -1) {
        // Add the new entry to the timeline array
        state[assignmentIndex].timeline.push(entryData);
      }
    },
    // Updates a specific assignment in the state
    updateAssignmentSlice(state, action) {
      const { assignmentId, updateData } = action.payload;
      const assignmentIndex = state.findIndex(assignment => assignment.id === assignmentId);
    
      if (assignmentIndex !== -1) {
          state[assignmentIndex] = { ...state[assignmentIndex], ...updateData };
      }
    },
    // Deletes an assignment from the state by its ID
    deleteDashboardAssignment(state, action) {
      const assignmentId = action.payload;
      if (state.length === 0) return state

      return state.filter((assignment) => assignment.id !== assignmentId)
    }
  },
  // Handle async actions using extraReducers for Inprogress, fulfilled, and rejected states
  extraReducers: (builder) => {
    builder
    .addCase(fetchConsultantAssignments.fulfilled, (state, action) => {
      return action.payload;
    }) 
    .addCase(fetchConsultantAssignments.rejected, (state, action) => {
      console.error("fetchConsultantAssignments rejected:", action.payload);
      return state;
    })
    .addCase(fetchConsultantDashboardAssignments.fulfilled, (state, action) => {
      // action.payload is a QuerySnapshot, so map to Assignment[]
      return action.payload.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Assignment[];
    })
  },
});

export const { setAssignments, addAssignment, addEntry, updateAssignmentSlice, deleteDashboardAssignment } = consultantAssignmentsSlice.actions;
export default consultantAssignmentsSlice.reducer;