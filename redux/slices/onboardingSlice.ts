import { onboardingSteps } from "@/lib/onboardingSteps";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isComplete: false,
    onboardingStep: 0,
}

const onboardingSlice = createSlice({
    name: 'onboarding',
    initialState,
    reducers: {
        // Set the onboarding state
        setOnboardingState(state, action) {
            return action.payload
        },
        // Mark onboarding as complete
        skip(state) {
            if (state) {
                state.isComplete = true
            }
        },
        // Advance to next step in onboarding
        next(state) {
            if (state) {
                state.onboardingStep += 1
            }
        },
        // Complete the current step if the required action is done
        completeStep(state, action) {
            const currentActionRequired = onboardingSteps[state.onboardingStep].actionRequired
            
            if (currentActionRequired === action.payload) {
                state.onboardingStep += 1
            }
        },
        completeOnboarding(state) {
            state.isComplete = true
        }
    }
})

export const { skip, next, completeStep, setOnboardingState, completeOnboarding } = onboardingSlice.actions;
export default onboardingSlice.reducer;