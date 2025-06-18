'use client'

import { onboardingSteps } from '@/lib/onboardingSteps';
import { RootState } from '@/redux/store';
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux'
import Tooltip from './Tooltip';
import { usePathname } from 'next/navigation';
import { completeOnboarding, next, skip } from '@/redux/slices/onboardingSlice';
import { completeOnboardingFirebase, nextStep } from '@/lib/onBoardingUtils';

const OnboardingManager = () => {
    // ALL HOOKS MUST BE CALLED FIRST - BEFORE ANY RETURNS
    const dispatch = useDispatch();
    const pathname = usePathname();
    const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
    const user = useSelector((state: RootState) => state.user);
    const { isComplete, onboardingStep } = useSelector((state: RootState) => state.onboarding);

    // Get step data (this is safe even if onboardingStep is undefined)
    const step = onboardingSteps[onboardingStep];

    // Effect to find and set the target element, with MutationObserver for dynamic content   
    useEffect(() => {
        if (!step?.target) {
            setTargetElement(null);
            return;
        }

        // First, try to find the element immediately
        const immediateElement = document.querySelector(step.target) as HTMLElement | null;
        if (immediateElement) {
            setTargetElement(immediateElement);
            console.log('immediate element', immediateElement)
            return;
        }

        // If not found, set up MutationObserver to watch for it
        const observer = new MutationObserver(() => {
            const element = document.querySelector(step.target) as HTMLElement | null;
            if (element) {
                setTargetElement(element);
                observer.disconnect(); // Stop observing once found
            }
        });

        // Start observing changes to the document
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Cleanup function
        return () => {
            observer.disconnect();
        };
    }, [step?.target, pathname]);

    // NOW we can do conditional returns - AFTER all hooks
    const excludedPaths = ['/signup', '/login', '/logout', '/'];
    if (excludedPaths.includes(pathname)) {
        return null;
    }

    // Early return if no user or user not loaded yet
    if (!user || user.id === '') {
        return null;
    }

    if (isComplete) {
        return null;
    }


    // Validate step exists and has required properties
    if (!step || !step.target || !step.content || !step.page || !step.path) {
        return null;
    }

    // Check if we should render tooltip based on path
    const pathMatches = (stepPath: string, currentPath: string): boolean => {
        return currentPath.startsWith(stepPath);
    };

    if (!pathMatches(step.path, pathname)) {
        return null;
    } 

    if (onboardingStep >= onboardingSteps.length) {
        return null;
    }

    // If target element doesn't exist, don't render
    if (!targetElement) {
        return null;
    }

    const handleOnSkip = () => {
        dispatch(skip());
    }

    const handleOnNext = async () => {
        dispatch(next())
        await nextStep(user.id)

        if (onboardingStep === onboardingSteps.length - 1) {
            dispatch(completeOnboarding())
            await completeOnboardingFirebase(user.id)
        }
    }

    return createPortal(
        <div className="onboarding-overlay">
            <Tooltip
                targetElement={targetElement}
                content={step.content}
                onNext={handleOnNext}
                onSkip={handleOnSkip}
                page={step.page}
                onboardingStep={onboardingStep}
            />
        </div>,
        document.body
    )
}

export default OnboardingManager