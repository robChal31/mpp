// app/components/OnBoardingTour.tsx
"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect, useCallback } from "react";
import { Joyride, EVENTS, ACTIONS, STATUS, type Step } from "react-joyride";
import CustomTooltip from "./CustomTooltip";

interface OnBoardingTourProps {
  pageName: string;
  steps: any;
  onComplete?: () => void;
}

export default function OnBoardingTour({ 
  pageName, 
  steps, 
  onComplete 
}: OnBoardingTourProps) {
    const t = useTranslations('OnboardingTour');
    const [run, setRun] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    // Mark as seen ke database
    const markAsSeen = useCallback(async () => {
        try {
            const response = await fetch("/api/user-tour", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pageName }),
            });
            
            if (!response.ok) {
                throw new Error("Failed to mark tour as seen");
            }
            
            console.log(`Tour ${pageName} marked as seen`);
        } catch (error) {
            console.error("Error marking tour as seen:", error);
        }
    }, [pageName]);

    // Handle event dari Joyride
    const handleEvent = useCallback((data: any, controls: any) => {
        const { action, index, status, type } = data;

        if (type === EVENTS.STEP_AFTER) {
            const newIndex = index + (action === ACTIONS.PREV ? -1 : 1);
            setStepIndex(newIndex);
        } 
        else if (type === EVENTS.TARGET_NOT_FOUND) {
            console.warn(`Target not found for step ${index}, skipping...`);
            const newIndex = index + (action === ACTIONS.PREV ? -1 : 1);
            setStepIndex(newIndex);
        }
        else if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
            setRun(false);
            markAsSeen();
            onComplete?.();
        }
    }, [markAsSeen, onComplete]);

    // Cek status dari database
    useEffect(() => {
        const checkSeenStatus = async () => {
            try {
                const res = await fetch(`/api/user-tour?pageName=${pageName}`);
                
                if (!res.ok) {
                    throw new Error("Failed to fetch tour status");
                }
                
                const data = await res.json();
                if (!data.seen) {
                    setRun(true);
                    setStepIndex(0);
                }
            } catch (error) {
                console.error("Error checking tour status:", error);
            } finally {
                setLoading(false);
            }
        };

        checkSeenStatus();
    }, [pageName]);

    if (loading) return null;
    if (!run) return null;

    return (
        <Joyride
            tooltipComponent={CustomTooltip}
            continuous
            run={run}
            stepIndex={stepIndex}
            steps={steps}
            onEvent={handleEvent}
            locale={{
                back: t("back"),
                close: t("close"),
                last: t("last"),
                next: t("next"),
                skip: t("skip"),
            }}
            options={{
                primaryColor: "#6366f1",
                backgroundColor: "#ffffff", 
                textColor: "#1f2937",
                zIndex: 1000,
            }}
            styles={{
                tooltip: {
                    borderRadius: "20px",
                    padding: "0",
                    overflow: "hidden",
                },
                tooltipTitle: {
                    padding: "20px 20px 0 20px",
                    fontSize: "20px",
                },
                tooltipContent: {
                    padding: "10px 20px",
                    fontSize: "14px",
                },
                tooltipFooter: {
                    padding: "12px 20px",
                    backgroundColor: "#f9fafb",
                    marginTop: "12px",
                },
                buttonPrimary: {
                    backgroundColor: "#6366f1",
                    borderRadius: "999px",
                    padding: "8px 20px",
                },
                buttonSkip: {
                    color: "#6b7280",
                },
                overlay: {
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    // HAPUS backdropFilter dari sini!
                },
                beacon: {
                    transform: "scale(1.2)",
                },
                beaconInner: {
                    backgroundColor: "#6366f1",
                },
                beaconOuter: {
                    borderColor: "rgba(99, 102, 241, 0.5)",
                },
                buttonClose: {
                    color: "#6b7280",
                    padding: "16px 20px",
                },
            }}
        />
    );
}