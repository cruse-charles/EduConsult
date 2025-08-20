import { Button } from "@/components/ui/button";
import { useLayoutEffect, useState } from "react";

interface TooltipProps {
    targetElement: HTMLElement | null;
    content: string;
    page: string;
    onSkip: () => void;
    onNext: () => void;
    onboardingStep: number;
}

const baseTooltipStyle = {
  position: "fixed",
  background: "white",
  padding: "1rem",
  borderRadius: "8px",
  zIndex: 10001,
  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
};

const Tooltip = ({targetElement, content, onSkip, onNext, page, onboardingStep}: TooltipProps) => {

    // if (!targetElement) return null;
    // const rect = targetElement.getBoundingClientRect()

    const [rect, setRect] = useState<DOMRect | null>(null);

    useLayoutEffect(() => {
        if (!targetElement) return;

        const measure = () => {
            setRect(targetElement.getBoundingClientRect());
        };

        measure();

        // Observe both body AND the target element for size changes
        const resizeObserver = new ResizeObserver(measure);
        resizeObserver.observe(document.body);
        resizeObserver.observe(targetElement);

        // Catch DOM mutations (e.g. async data loading that shifts layout)
        const mutationObserver = new MutationObserver(measure);
        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
        });

        window.addEventListener("scroll", measure);

        return () => {
            resizeObserver.disconnect();
            mutationObserver.disconnect();
            window.removeEventListener("scroll", measure);
        };
    }, [targetElement, onboardingStep]);
    
    if (!rect) return null;

    // const stepPositions: Record<number, { top: number; left: number }>  = {
    //     0: {top: rect.bottom + 10, left: rect.left},
    //     1: {top: rect.bottom + 10, left: rect.left - 200},
    //     2: {top: rect.bottom + 10, left: rect.left},
    //     3: {top: rect.bottom + 10, left: rect.left - 100},
    //     4: {top: rect.bottom + 10, left: rect.left},
    //     5: {top: rect.bottom + 10, left: rect.left},
    //     6: {top: rect.bottom + 30, left: rect.left + 500},
    //     7: {top: rect.bottom + 10, left: rect.left},
    //     8: {top: rect.bottom + 10, left: rect.left},
    //     9: {top: rect.bottom + 10, left: rect.left},
    //     10: {top: rect.bottom + 10, left: rect.left}
    // }

    const stepPositions: Record<number, { top: number; left: number }> = {
        0: { top: rect.bottom + window.scrollY + 10, left: rect.left + window.scrollX },
        1: { top: rect.bottom + window.scrollY + 10, left: rect.left + window.scrollX - 200 },
        2: { top: rect.bottom + window.scrollY + 10, left: rect.left + window.scrollX },
        3: { top: rect.bottom + window.scrollY + 10, left: rect.left + window.scrollX - 100 },
        4: { top: rect.bottom + window.scrollY + 10, left: rect.left + window.scrollX },
        5: { top: rect.bottom + window.scrollY + 10, left: rect.left + window.scrollX },
        6: { top: rect.bottom + window.scrollY + 30, left: rect.left + window.scrollX + 500 },
        7: { top: rect.bottom + window.scrollY + 10, left: rect.left + window.scrollX },
        8: { top: rect.bottom + window.scrollY + 10, left: rect.left + window.scrollX },
        9: { top: rect.bottom + window.scrollY + 10, left: rect.left + window.scrollX },
        10: {top: rect.bottom + window.scrollY + 10, left: rect.left + window.scrollX },
        11: {top: rect.bottom + window.scrollY + 10, left: rect.left + window.scrollX },
    };

    const tooltipStyles = {
        ...baseTooltipStyle,
        ...stepPositions[onboardingStep]
    }

    const highlightStyles = {
        position: "absolute" as const,
        top: rect.top + window.scrollY - 6,
        left: rect.left + window.scrollX - 6,
        width: rect.width + 12,
        height: rect.height + 12,
        borderRadius: "8px",
        pointerEvents: "none",
        zIndex: 10000,
        
        backgroundImage: `
            linear-gradient(to right, #3b82f6 50%, transparent 50%),
            linear-gradient(to right, #3b82f6 50%, transparent 50%),
            linear-gradient(to bottom, #3b82f6 50%, transparent 50%),
            linear-gradient(to bottom, #3b82f6 50%, transparent 50%)
        `,
        backgroundSize: `
            16px 5px,
            16px 5px,
            5px 16px,
            5px 16px
        `,
        backgroundPosition: `
            0 0,
            0 100%,
            0 0,
            100% 0
        `,
        backgroundRepeat: "repeat-x, repeat-x, repeat-y, repeat-y",
        animation: "dash-move 2s linear infinite",
    };


    // Restrict which steps can have the 'next' button
    const allowedNextSteps = [0, 8, 9, 10, 11]

    return (
        <>
            {/* @ts-ignore */}
            <div style={highlightStyles}>

            </div>
            
            {/* @ts-ignore */}
            <div className="tooltip" style={tooltipStyles}>
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
        </>
    )
}

export default Tooltip