// app/components/CustomTooltip.tsx
"use client";

import { ArrowRight, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface CustomTooltipProps {
  continuous: boolean;
  index: number;
  step: any;
  backProps: any;
  closeProps: any;
  primaryProps: any;
  skipProps: any;
  tooltipProps: any;
  size: number;        // ← ganti steps jadi size
  isLastStep: boolean;
}

export default function CustomTooltip({
  continuous,
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  skipProps,
  tooltipProps,
  size,           // ← pake size
  isLastStep,
}: CustomTooltipProps) {
  const t = useTranslations("OnboardingTour");

  return (
    <div
      {...tooltipProps}
      className="bg-white rounded-2xl shadow-2xl w-95 max-w-[90vw] overflow-hidden"
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-indigo-500">
            Step {index + 1} of {size}   {/* ← pake size */}
          </span>
        </div>
        <button
          {...closeProps}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {step.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {step.content}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-4 bg-gray-50 border-t border-gray-100">
        <div className="flex gap-2">
          {continuous && index !== 0 && (
            <button
              {...backProps}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              {t("back")}
            </button>
          )}
          {!isLastStep && (
            <button
              {...skipProps}
              className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
            >
              {t("skip")}
            </button>
          )}
        </div>
        <button
          {...primaryProps}
          className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-all shadow-sm hover:shadow-md"
        >
          {isLastStep ? `${t("finish")}` : `${t("next")}`}
          {!isLastStep && <ArrowRight size={16} />}
        </button>
      </div>
    </div>
  );
}