"use client";

import React, { useState } from "react";
import { DynamicStudyPlan, DynamicStudyPlanPhase, DynamicStudyPlanStep } from "@/lib/services/studyPlanService";
import { 
  Clock, 
  CheckCircle2, 
  Circle, 
  Lock, 
  Play, 
  BookOpen, 
  Code, 
  Trophy,
  Target,
  ChevronDown,
  ChevronRight,
  Loader2,
  Globe,
  Palette,
  Sprout,
  MousePointer,
  Building,
  Zap,
  Flame,
  Database
} from "lucide-react";

interface StudyPlanRoadmapProps {
  studyPlan: DynamicStudyPlan;
  completedSteps: string[];
  currentStepId?: string;
  onStartStep?: (stepId: string) => void;
  onViewStep?: (stepId: string) => void;
  navigatingStepId?: string | null;
}

// Map icon names to Lucide components
const getPhaseIcon = (iconName: string) => {
  const iconMap = {
    'Globe': Globe,
    'Palette': Palette,
    'Sprout': Sprout,
    'MousePointer': MousePointer,
    'Building': Building,
    'Zap': Zap,
    'Flame': Flame,
    'Database': Database,
  };
  
  const IconComponent = iconMap[iconName as keyof typeof iconMap] || Circle;
  return <IconComponent className="w-6 h-6" />;
};

export function StudyPlanRoadmap({ 
  studyPlan, 
  completedSteps, 
  currentStepId,
  onStartStep,
  onViewStep,
  navigatingStepId
}: StudyPlanRoadmapProps) {
  const [expandedPhases, setExpandedPhases] = useState<string[]>([]);

  const togglePhase = (phaseId: string) => {
    setExpandedPhases(prev =>
      prev.includes(phaseId)
        ? prev.filter(id => id !== phaseId)
        : [...prev, phaseId]
    );
  };

  const isStepAvailable = (step: DynamicStudyPlanStep): boolean => {
    return step.prerequisites.every(prereq => completedSteps.includes(prereq));
  };

  const getStepIcon = (step: DynamicStudyPlanStep) => {
    switch (step.type) {
      case "tutorial":
        return <BookOpen className="w-4 h-4" />;
      case "challenge":
        return <Code className="w-4 h-4" />;
      case "quiz":
        return <Target className="w-4 h-4" />;
      case "project":
        return <Trophy className="w-4 h-4" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  const getStepStatus = (step: DynamicStudyPlanStep) => {
    if (completedSteps.includes(step.id)) {
      return "completed";
    } else if (step.id === currentStepId) {
      return "current";
    } else if (isStepAvailable(step)) {
      return "available";
    } else {
      return "locked";
    }
  };

  const getStepStatusIcon = (step: DynamicStudyPlanStep) => {
    const status = getStepStatus(step);
    
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "current":
        return <Play className="w-5 h-5 text-blue-500" />;
      case "available":
        return <Circle className="w-5 h-5 text-gray-400" />;
      case "locked":
        return <Lock className="w-5 h-5 text-gray-300" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPhaseProgress = (phase: DynamicStudyPlanPhase) => {
    const allPhaseSteps = [...phase.steps, ...phase.projects];
    const completedInPhase = allPhaseSteps.filter(step => completedSteps.includes(step.id)).length;
    return allPhaseSteps.length > 0 ? (completedInPhase / allPhaseSteps.length) * 100 : 0;
  };

  // Auto-expand current phase
  React.useEffect(() => {
    const currentPhase = studyPlan.phases.find(phase =>
      phase.steps.some(step => step.id === currentStepId)
    );
    if (currentPhase && !expandedPhases.includes(currentPhase.id)) {
      setExpandedPhases(prev => [...prev, currentPhase.id]);
    }
  }, [currentStepId, studyPlan.phases, expandedPhases]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Learning Roadmap
        </h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {studyPlan.phases.length} phases • {studyPlan.totalWeeks} weeks • {studyPlan.totalHours} hours
        </div>
      </div>

      <div className="space-y-4">
        {studyPlan.phases.map((phase, phaseIndex) => {
          const isExpanded = expandedPhases.includes(phase.id);
          const progress = getPhaseProgress(phase);
          const isPhaseCompleted = progress === 100;
          const hasStepsInProgress = phase.steps.some(step => 
            getStepStatus(step) === "current" || getStepStatus(step) === "available"
          );

          return (
            <div
              key={phase.id}
              className={`bg-white dark:bg-gray-800 rounded-xl border transition-all duration-200 ${
                hasStepsInProgress && !isPhaseCompleted
                  ? "border-blue-200 dark:border-blue-800 shadow-md"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              {/* Phase Header */}
              <button
                onClick={() => togglePhase(phase.id)}
                className="w-full p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${phase.color} flex items-center justify-center text-white`}>
                      {getPhaseIcon(phase.icon)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {phase.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {phase.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{phase.estimatedWeeks} weeks</span>
                        <span>{phase.steps.length + phase.projects.length} items</span>
                        <span>{[...phase.steps, ...phase.projects].reduce((sum, step) => sum + step.estimatedHours, 0)} hours</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {Math.round(progress)}%
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {[...phase.steps, ...phase.projects].filter(s => completedSteps.includes(s.id)).length} / {phase.steps.length + phase.projects.length}
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r ${phase.color} rounded-full h-2 transition-all duration-500`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </button>

              {/* Phase Steps */}
              {isExpanded && (
                <div className="px-6 pb-6">
                  <div className="space-y-3">
                    {[...phase.steps, ...phase.projects].map((step, stepIndex) => {
                      const status = getStepStatus(step);
                      const isLast = stepIndex === phase.steps.length + phase.projects.length - 1;

                      return (
                        <div key={step.id} className="flex items-start gap-4">
                          {/* Connection Line */}
                          <div className="flex flex-col items-center">
                            {getStepStatusIcon(step)}
                            {!isLast && (
                              <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mt-2" />
                            )}
                          </div>

                          {/* Step Content */}
                          <div className={`flex-1 p-4 rounded-lg border transition-all ${
                            status === "current"
                              ? "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20"
                              : status === "available"
                              ? "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                              : status === "completed"
                              ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
                              : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-60"
                          }`}>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  {getStepIcon(step)}
                                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                    {step.title}
                                  </h4>
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    step.type === "tutorial"
                                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                      : step.type === "challenge"
                                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                      : step.type === "quiz"
                                      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                                      : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                                  }`}>
                                    {step.type}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  {step.description}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {step.estimatedHours}h
                                  </span>
                                  <span className={`px-2 py-1 rounded-full ${
                                    step.difficulty === 'beginner' 
                                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                      : step.difficulty === 'intermediate'
                                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                  }`}>
                                    {step.difficulty}
                                  </span>
                                  {step.skills.length > 0 && (
                                    <span>Skills: {step.skills.slice(0, 2).join(", ")}</span>
                                  )}
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-2 ml-4">
                                {status === "available" && onStartStep && (
                                  <button
                                    onClick={() => onStartStep(step.id)}
                                    disabled={navigatingStepId === step.id}
                                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded text-sm font-medium transition-colors flex items-center gap-1"
                                  >
                                    {navigatingStepId === step.id ? (
                                      <>
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        Loading...
                                      </>
                                    ) : (
                                      'Start'
                                    )}
                                  </button>
                                )}
                                {status === "completed" && onViewStep && (
                                  <button
                                    onClick={() => onViewStep(step.id)}
                                    disabled={navigatingStepId === step.id}
                                    className="px-3 py-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded text-sm font-medium transition-colors flex items-center gap-1"
                                  >
                                    {navigatingStepId === step.id ? (
                                      <>
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        Loading...
                                      </>
                                    ) : (
                                      'Review'
                                    )}
                                  </button>
                                )}
                                {status === "current" && onViewStep && (
                                  <button
                                    onClick={() => onViewStep(step.id)}
                                    disabled={navigatingStepId === step.id}
                                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded text-sm font-medium transition-colors flex items-center gap-1"
                                  >
                                    {navigatingStepId === step.id ? (
                                      <>
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        Loading...
                                      </>
                                    ) : (
                                      'Continue'
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}