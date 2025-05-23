import React, { useState } from 'react';
import EventModal from './EventModal';
import CleanEventModal from './CleanEventModal';
import { Event } from '@/types/Event';

const AnimationDemo: React.FC = () => {
  const [showOldModal, setShowOldModal] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [sourceElement, setSourceElement] = useState<HTMLElement | null>(null);

  const sampleEvent: Event & { sourceElement?: HTMLElement } = {
    id: 'demo-event',
    title: 'Demo Event with Animation',
    startDate: new Date(),
    endDate: new Date(Date.now() + 3600000), // 1 hour later
    description: 'This is a demo event to test the animation system.',
    location: 'Demo Location',
    isAllDay: false,
    sourceElement: sourceElement || undefined
  };

  const handleOldModalClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setSourceElement(e.currentTarget);
    setShowOldModal(true);
  };

  const handleNewModalClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setSourceElement(e.currentTarget);
    setShowNewModal(true);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Animation System Comparison</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Old Animation System</h2>
          <p className="text-gray-600 mb-4">
            Uses complex SharedElementPortal with multiple phases, extensive debugging, 
            and manual DOM manipulation.
          </p>
          <button
            onClick={handleOldModalClick}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
          >
            Test Old Modal Animation
          </button>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">New Clean Animation System</h2>
          <p className="text-gray-600 mb-4">
            Uses useGSAP hook with proper cleanup, simplified state management, 
            and Context7 best practices.
          </p>
          <button
            onClick={handleNewModalClick}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
          >
            Test New Modal Animation
          </button>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Key Improvements in Clean System:</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li><strong>useGSAP Hook:</strong> Automatic cleanup and context management</li>
          <li><strong>Simplified State:</strong> Only 3 phases instead of 4</li>
          <li><strong>Better Performance:</strong> Reduced measurement attempts and cleaner code</li>
          <li><strong>Type Safety:</strong> Better TypeScript integration</li>
          <li><strong>Maintainability:</strong> Much smaller codebase with clear separation of concerns</li>
          <li><strong>Context7 Compliant:</strong> Follows established best practices</li>
        </ul>
      </div>

      {/* Old Modal */}
      <EventModal
        event={sampleEvent}
        isOpen={showOldModal}
        onClose={() => setShowOldModal(false)}
      />

      {/* New Modal */}
      <CleanEventModal
        event={sampleEvent}
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
      />
    </div>
  );
};

export default AnimationDemo; 