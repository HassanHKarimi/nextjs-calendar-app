import React, { useState, useRef } from 'react';
import CleanEventModal from './CleanEventModal';
import { Event } from '@/types/Event';
import { ANIMATION_CONFIG } from './animation/cleanAnimationConfig';

const TimingDemo: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [sourceElement, setSourceElement] = useState<HTMLElement | null>(null);
  const [timingConfig, setTimingConfig] = useState(ANIMATION_CONFIG);

  const handleTestClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const buttonElement = e.currentTarget;
    console.log('Button clicked, setting source element:', buttonElement);
    setSourceElement(buttonElement);
    setShowModal(true);
  };

  // Create event object with current sourceElement
  const sampleEvent: Event & { sourceElement?: HTMLElement } = React.useMemo(() => ({
    id: 'timing-demo-event',
    title: 'Perfect Timing Demo',
    startDate: new Date(),
    endDate: new Date(Date.now() + 3600000),
    description: 'Testing the refined animation timing system.',
    location: 'Timing Lab',
    isAllDay: false,
    sourceElement: sourceElement || undefined
  }), [sourceElement]);

  const updateConfig = (path: string, value: number) => {
    const newConfig = { ...timingConfig };
    const keys = path.split('.');
    let current: any = newConfig;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    setTimingConfig(newConfig);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Animation Timing Laboratory</h1>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Test Area */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test Animation</h2>
          <p className="text-gray-600 mb-6">
            Click the button below to test the current animation timing. 
            Adjust the values on the right to perfect the timing.
          </p>
          
          <button
            onClick={handleTestClick}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium transition-colors"
            style={{
              transform: 'translateY(0)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Test Perfect Timing ✨
          </button>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2">Current Timing Sequence:</h3>
            <ul className="text-sm space-y-1">
              <li>📍 <strong>Shared Element:</strong> {timingConfig.sharedElement.duration}s ({timingConfig.sharedElement.easing})</li>
              <li>📺 <strong>Overlay Fade:</strong> {timingConfig.modal.overlay.duration}s (starts immediately)</li>
              <li>📄 <strong>Content Slide:</strong> {timingConfig.modal.content.duration}s (delay: {timingConfig.modal.content.delay}s)</li>
              <li>👻 <strong>Element Fade Out:</strong> {timingConfig.sharedElement.fadeOutDuration}s (starts {Math.abs(timingConfig.sharedElement.fadeOutOffset)}s after animation ends)</li>
            </ul>
          </div>
        </div>

        {/* Timing Controls */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Timing Controls</h2>
          
          <div className="space-y-6">
            {/* Shared Element */}
            <div>
              <h3 className="font-medium mb-3 text-gray-800">Shared Element Animation</h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Duration (seconds)</label>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={timingConfig.sharedElement.duration}
                    onChange={(e) => updateConfig('sharedElement.duration', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">{timingConfig.sharedElement.duration}s</span>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Fade Out Duration</label>
                  <input
                    type="range"
                    min="0.05"
                    max="0.3"
                    step="0.01"
                    value={timingConfig.sharedElement.fadeOutDuration}
                    onChange={(e) => updateConfig('sharedElement.fadeOutDuration', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">{timingConfig.sharedElement.fadeOutDuration}s</span>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div>
              <h3 className="font-medium mb-3 text-gray-800">Modal Content</h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Overlay Duration</label>
                  <input
                    type="range"
                    min="0.1"
                    max="0.5"
                    step="0.05"
                    value={timingConfig.modal.overlay.duration}
                    onChange={(e) => updateConfig('modal.overlay.duration', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">{timingConfig.modal.overlay.duration}s</span>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Content Duration</label>
                  <input
                    type="range"
                    min="0.1"
                    max="0.6"
                    step="0.05"
                    value={timingConfig.modal.content.duration}
                    onChange={(e) => updateConfig('modal.content.duration', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">{timingConfig.modal.content.duration}s</span>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Content Delay</label>
                  <input
                    type="range"
                    min="0"
                    max="0.2"
                    step="0.01"
                    value={timingConfig.modal.content.delay}
                    onChange={(e) => updateConfig('modal.content.delay', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">{timingConfig.modal.content.delay}s</span>
                </div>
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => setTimingConfig(ANIMATION_CONFIG)}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded transition-colors"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>

      {/* Performance Tips */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3 text-yellow-800">🎯 Timing Tips</h3>
        <ul className="space-y-2 text-yellow-700">
          <li><strong>Shared Element:</strong> 0.4-0.5s feels natural for most transitions</li>
          <li><strong>Content Delay:</strong> 0.08-0.12s creates smooth handoff from shared element</li>
          <li><strong>Fade Out:</strong> Start after modal content is visible for perfect handoff</li>
          <li><strong>Easing:</strong> power3.out for shared element, power2.out for content feels polished</li>
        </ul>
      </div>

      {/* Modal */}
      <CleanEventModal
        event={sampleEvent}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        customConfig={timingConfig}
      />
    </div>
  );
};

export default TimingDemo; 