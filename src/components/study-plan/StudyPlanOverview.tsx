"use client";

import React from "react";
import { DynamicStudyPlan, DynamicStudyPlanPhase } from "@/lib/services/studyPlanService";
import { Clock, Target, BookOpen, Award, ChevronRight, Play, Loader2 } from "lucide-react";

interface StudyPlanOverviewProps {
  studyPlan: DynamicStudyPlan;
  completedSteps: string[];
  hoursSpent: number;
  onStartStep?: (stepId: string) => void;
  navigatingStepId?: string | null;
}

export function StudyPlanOverview({ 
  studyPlan, 
  completedSteps, 
  hoursSpent,
  onStartStep,
  navigatingStepId
}: StudyPlanOverviewProps) {
  // Calculate progress
  const totalSteps = studyPlan.phases.reduce(
    (sum, phase) => sum + phase.steps.length + phase.projects.length, 0
  );
  const progressPercentage = totalSteps > 0 
    ? Math.round((completedSteps.length / totalSteps) * 100) 
    : 0;

  // Find current phase
  const currentPhase = studyPlan.phases.find(phase => {
    const phaseSteps = [...phase.steps, ...phase.projects].map(s => s.id);
    const completedInPhase = phaseSteps.filter(stepId => completedSteps.includes(stepId));
    return completedInPhase.length < phaseSteps.length;
  }) || studyPlan.phases[studyPlan.phases.length - 1];

  // Find next step
  const nextStep = studyPlan.phases
    .flatMap(phase => [...phase.steps, ...phase.projects])
    .find(step => {
      if (completedSteps.includes(step.id)) return false;
      const prerequisitesMet = step.prerequisites.every(prereq => 
        completedSteps.includes(prereq)
      );
      return prerequisitesMet;
    });

  // Get skills learned
  const skillsLearned = Array.from(new Set(
    studyPlan.phases
      .flatMap(phase => [...phase.steps, ...phase.projects])
      .filter(step => completedSteps.includes(step.id))
      .flatMap(step => step.skills)
  ));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{studyPlan.title}</h1>
            <p className="text-blue-100 text-lg">{studyPlan.description}</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{progressPercentage}%</div>
            <div className="text-blue-200">Complete</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-6">
          <div className="bg-blue-500/30 rounded-full h-3">
            <div
              className="bg-white rounded-full h-3 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {hoursSpent}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                of {studyPlan.totalHours} hours
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {completedSteps.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Steps Completed
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {currentPhase?.title.match(/\d+/)?.[0] || studyPlan.phases.findIndex(p => p.id === currentPhase?.id) + 1}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Current Phase
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {skillsLearned.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Skills Learned
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Phase */}
        {currentPhase && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Current Phase
            </h3>
            <div className={`bg-gradient-to-r ${currentPhase.color} rounded-lg p-4 text-white mb-4`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{currentPhase.icon}</span>
                <div>
                  <h4 className="font-semibold">{currentPhase.title}</h4>
                  <p className="text-sm opacity-90">{currentPhase.description}</p>
                </div>
              </div>
            </div>
            
            {/* Phase Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Phase Progress</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {[...currentPhase.steps, ...currentPhase.projects].filter(step => completedSteps.includes(step.id)).length} / {currentPhase.steps.length + currentPhase.projects.length}
                </span>
              </div>
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`bg-gradient-to-r ${currentPhase.color} rounded-full h-2 transition-all duration-300`}
                  style={{
                    width: `${([...currentPhase.steps, ...currentPhase.projects].filter(step => completedSteps.includes(step.id)).length / (currentPhase.steps.length + currentPhase.projects.length)) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Next Step */}
        {nextStep && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Next Step
            </h3>
            <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {nextStep.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {nextStep.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {nextStep.estimatedHours}h
                    </span>
                    <span className={`px-2 py-1 rounded-full ${
                      nextStep.difficulty === 'beginner' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                        : nextStep.difficulty === 'intermediate'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {nextStep.difficulty}
                    </span>
                  </div>
                </div>
                {onStartStep && (
                  <button
                    onClick={() => onStartStep(nextStep.id)}
                    disabled={navigatingStepId === nextStep.id}
                    className="ml-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    {navigatingStepId === nextStep.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Start
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Skills Learned */}
      {skillsLearned.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Skills You&apos;ve Learned
          </h3>
          <div className="flex flex-wrap gap-2">
            {skillsLearned.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}