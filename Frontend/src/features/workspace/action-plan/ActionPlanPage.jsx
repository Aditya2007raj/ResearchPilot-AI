import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { usePaperActionPlan } from '../../../lib/hooks';
import { RoadmapTracker } from './components/RoadmapTracker';
import { PhaseCard } from './components/PhaseCard';
import { TaskCard } from './components/TaskCard';

export function ActionPlanPage() {
  const { paperId, onCitationClick } = useOutletContext();
  const { data: actionResult, isLoading, error } = usePaperActionPlan(paperId);
  const [phases, setPhases] = useState([]);

  // Safe helper to convert any array, string, object, or null into a structured array of strings
  const normalizeToArray = (fieldValue) => {
    if (!fieldValue) return [];
    if (Array.isArray(fieldValue)) {
      return fieldValue.map(item => {
        if (typeof item === 'string') return item;
        if (typeof item === 'object' && item !== null) {
          return item.text || item.title || item.name || JSON.stringify(item);
        }
        return String(item);
      });
    }
    if (typeof fieldValue === 'string') {
      // Split by commas or newlines if it's a list in string format
      if (fieldValue.includes('\n')) {
        return fieldValue.split('\n').map(s => s.trim().replace(/^-\s*/, '')).filter(Boolean);
      }
      if (fieldValue.includes(',')) {
        return fieldValue.split(',').map(s => s.trim()).filter(Boolean);
      }
      return [fieldValue];
    }
    if (typeof fieldValue === 'object') {
      // If it's a flat object of key-value items
      return Object.entries(fieldValue).map(([key, val]) => `${key}: ${val}`);
    }
    return [String(fieldValue)];
  };

  useEffect(() => {
    if (actionResult?.data?.action_plan) {
      const plan = actionResult.data.action_plan;
      
      // Defensively parse values
      const rawSkills = normalizeToArray(plan.skills_to_learn);
      const rawPath = normalizeToArray(plan.learning_path);
      const rawProjects = normalizeToArray(plan.project_ideas);
      const rawResources = normalizeToArray(plan.recommended_resources);

      const mappedPhases = [
        {
          id: 'phase-skills',
          order: 1,
          title: 'Prerequisite Skills & Core Concepts',
          subtitle: 'Core terminology and foundational paradigms',
          tasks: rawSkills.map((skill, idx) => ({
            id: `task-skill-${idx}`,
            title: `Master: ${skill}`,
            instruction: `Review and understand the application of ${skill} inside the context of this paper's methodology.`,
            refId: null,
            refLabel: '',
            notes: '',
            isCompleted: false
          }))
        },
        {
          id: 'phase-path',
          order: 2,
          title: 'Step-by-Step Implementation Roadmap',
          subtitle: `Timeline target: ${plan.estimated_timeline || 'Standard duration'}`,
          tasks: rawPath.map((step, idx) => ({
            id: `task-path-${idx}`,
            title: step,
            instruction: 'Implement, run, and log test outputs matching these guidelines.',
            refId: null,
            refLabel: '',
            notes: '',
            isCompleted: false
          }))
        },
        {
          id: 'phase-projects',
          order: 3,
          title: 'Practical Project Scenarios',
          subtitle: 'Apply concepts in real-world environments',
          tasks: rawProjects.map((idea, idx) => ({
            id: `task-project-${idx}`,
            title: idea,
            instruction: 'Draft a project layout implementing code structures based on this project concept.',
            refId: null,
            refLabel: '',
            notes: '',
            isCompleted: false
          }))
        },
        {
          id: 'phase-resources',
          order: 4,
          title: 'Recommended Resources',
          subtitle: 'Recommended readings and tools',
          tasks: rawResources.map((resource, idx) => ({
            id: `task-resource-${idx}`,
            title: `Explore: ${resource}`,
            instruction: 'Read literature, documentation, or study courses relating to this resource specification.',
            refId: null,
            refLabel: '',
            notes: '',
            isCompleted: false
          }))
        }
      ];

      setPhases(mappedPhases.filter(p => p.tasks.length > 0));
    }
  }, [actionResult]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-xs font-mono text-[var(--text-secondary)]">
        Generating Action Plan Timeline...
      </div>
    );
  }

  if (error || !actionResult?.data) {
    return (
      <div className="p-6 border border-rose-500/20 bg-[var(--bg-surface)] text-rose-400 rounded text-xs font-mono">
        Failed to fetch action plan data. Please ensure the backend server is operational.
      </div>
    );
  }

  const handleToggleComplete = (taskId) => {
    setPhases((prev) =>
      prev.map((phase) => ({
        ...phase,
        tasks: phase.tasks.map((task) =>
          task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
        ),
      }))
    );
  };

  const handleSaveNotes = (taskId, notesText) => {
    setPhases((prev) =>
      prev.map((phase) => ({
        ...phase,
        tasks: phase.tasks.map((task) =>
          task.id === taskId ? { ...task, notes: notesText } : task
        ),
      }))
    );
  };

  const totalTasks = phases.reduce((sum, phase) => sum + phase.tasks.length, 0);
  const completedTasks = phases.reduce(
    (sum, phase) => sum + phase.tasks.filter((t) => t.isCompleted).length,
    0
  );
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      <RoadmapTracker
        completionPercentage={completionPercentage}
        totalTasks={totalTasks}
        completedTasks={completedTasks}
      />

      <div className="space-y-6">
        {phases.map((phase) => (
          <PhaseCard 
            key={phase.id} 
            order={phase.order} 
            title={phase.title} 
            subtitle={phase.subtitle}
          >
            <div className="space-y-3">
              {phase.tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onSaveNotes={handleSaveNotes}
                  onCitationClick={onCitationClick}
                />
              ))}
            </div>
          </PhaseCard>
        ))}
      </div>
    </div>
  );
}

export default ActionPlanPage;
