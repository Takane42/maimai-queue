'use client';

import { useState } from 'react';
import { useQueue } from '../contexts/QueueContext';

const AddToQueueForm = () => {
  const { addToQueue, isLoading, isOffline } = useQueue();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name1: '',
    name2: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error message when user starts typing
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name1.trim()) {
      setErrorMessage('At least one name is required');
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Add to queue
      const newPerson = await addToQueue(formData);
      
      // Reset form and show success message
      setFormData({
        name1: '',
        name2: '',
        notes: '',
      });
      
      setSuccessMessage(`Queue #${newPerson.number} has been added`);
      setTimeout(() => setSuccessMessage(''), 5000);
      setIsOpen(false);
    } catch (error) {
      setErrorMessage('Failed to add to queue. Please try again.');
      console.error('Error adding to queue:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="mb-6">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          disabled={isOffline}
          className={`w-full font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center ${
            isOffline 
              ? 'bg-gray-400 dark:bg-gray-600 text-gray-200 dark:text-gray-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          {isOffline ? 'Machine Offline' : 'Add to Queue'}
        </button>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add to Queue</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name 1 *
              </label>
              <input
                type="text"
                id="name1"
                name="name1"
                value={formData.name1}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter first person's name"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="name2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name 2
              </label>
              <input
                type="text"
                id="name2"
                name="name2"
                value={formData.name2}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter second person's name (optional)"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Any additional information (optional)"
              ></textarea>
            </div>
            
            {errorMessage && (
              <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-400 rounded-md p-3">
                {errorMessage}
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="mr-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.name1.trim() || isOffline}
                className={`bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-md transition-colors ${
                  (isSubmitting || !formData.name1.trim() || isOffline) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Adding...' : isOffline ? 'Machine Offline' : 'Add to Queue'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {successMessage && (
        <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-400 rounded-md p-4">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default AddToQueueForm;
