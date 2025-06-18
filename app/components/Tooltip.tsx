import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface TooltipProps {
    targetElement: HTMLElement | null;
    content: string;
    page: string;
    onSkip: () => void;
    onNext: () => void;
    onboardingStep: number;
}

const baseTooltipStyle = {
  position: "absolute",
  background: "white",
  padding: "1rem",
  borderRadius: "8px",
  zIndex: 10001,
  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
};

const Tooltip = ({targetElement, content, onSkip, onNext, page, onboardingStep}: TooltipProps) => {

    if (!targetElement) return null;
    const rect = targetElement.getBoundingClientRect()

    const stepPositions: Record<number, { top: number; left: number }>  = {
        0: {top: rect.bottom + 10, left: rect.left},
        1: {top: rect.bottom + 10, left: rect.left - 200},
        2: {top: rect.bottom + 10, left: rect.left},
        3: {top: rect.bottom + 10, left: rect.left - 100},
        4: {top: rect.bottom + 10, left: rect.left},
        5: {top: rect.bottom + 10, left: rect.left},
        6: {top: rect.bottom + 30, left: rect.left + 500},
        7: {top: rect.bottom + 10, left: rect.left},
        8: {top: rect.bottom + 10, left: rect.left},
        9: {top: rect.bottom + 10, left: rect.left}
    }

    const tooltipStyles = {
        ...baseTooltipStyle,
        ...stepPositions[onboardingStep]
    }

    // TODO: Evaluate below and refator for better tooltip positioning, scrolling, and resizing window, etc
    // const [position, setPosition] = useState({ top: 0, left: 0 });

    // // // Function to calculate position based on target element
    // const calculatePosition = () => {
    //     if (!targetElement) return;
        
    //     const rect = targetElement.getBoundingClientRect();
        
    //     const stepPositions: Record<number, { top: number; left: number }> = {
    //         0: {top: rect.bottom + 10, left: rect.left},
    //         1: {top: rect.bottom + 10, left: rect.left - 200},
    //         2: {top: rect.bottom + 10, left: rect.left},
    //         3: {top: rect.bottom + 10, left: rect.left - 100},
    //         4: {top: rect.bottom + 10, left: rect.left},
    //         5: {top: rect.bottom + 10, left: rect.left},
    //         6: {top: rect.bottom + 30, left: rect.left + 500},
    //         7: {top: rect.bottom + 10, left: rect.left},
    //         8: {top: rect.bottom + 10, left: rect.left},
    //         9: {top: rect.bottom + 10, left: rect.left}
    //     };
        
    //     setPosition(stepPositions[onboardingStep]);
    // };

    // // Calculate position on mount and when dependencies change
    // useEffect(() => {
    //     calculatePosition();
    // }, [targetElement, onboardingStep]);

    // // Recalculate position on window resize or scroll
    // useEffect(() => {
    //     const handleUpdate = () => {
    //         calculatePosition();
    //     };

    //     window.addEventListener('resize', handleUpdate);
    //     window.addEventListener('scroll', handleUpdate, true); // Use capture to catch all scroll events
        
    //     return () => {
    //         window.removeEventListener('resize', handleUpdate);
    //         window.removeEventListener('scroll', handleUpdate, true);
    //     };
    // }, [targetElement, onboardingStep]);

    // if (!targetElement) return null;

    // const tooltipStyles = {
    //     ...baseTooltipStyle,
    //     ...position
    // };



    // Restrict which steps can have the 'next' button
    // const allowedNextSteps = [0, 7, 8]
    const allowedNextSteps = [0, 1,2,3,4,5,6, 7, 8]


    return (
        <div
        className="tooltip"
        // @ts-ignore
        style={tooltipStyles}>
            <p>{content}</p>
            <div className="flex items-center justify-between mt-2">
                <div className="flex gap-2">
                    {allowedNextSteps.includes(onboardingStep) && (
                        <Button onClick={onNext} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                            Next
                        </Button>
                    )}
                    {/* <Button onClick={onSkip} className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">
                        Skip
                    </Button> */}
                </div>
                <span className="text-sm text-gray-500">{page}</span>
            </div>
        </div>
    )
}

export default Tooltip