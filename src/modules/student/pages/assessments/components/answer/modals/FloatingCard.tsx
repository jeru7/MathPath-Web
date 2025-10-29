import { type ReactElement } from "react";
import { Assessment } from "../../../../../../core/types/assessment/assessment.type";
import {
  IoCheckmark,
  IoClose,
  IoDocument,
  IoInformation,
  IoTime,
} from "react-icons/io5";
import DetailItem from "./DetailItem";

type FloatingCardProps = {
  assessment: Assessment;
  onClose: () => void;
};

export function FloatingCard({
  assessment,
  onClose,
}: FloatingCardProps): ReactElement {
  return (
    <div className="fixed h-[100vh] w-[100vw] lg:absolute lg:top-6 lg:right-6 lg:w-80">
      <div className="lg:hidden fixed inset-0 bg-white dark:bg-gray-900 z-50">
        {/* header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <IoInformation className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span>Assessment Details</span>
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Close details"
            >
              <IoClose className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* content */}
        <div className="h-[calc(100vh-80px)] overflow-y-auto p-4">
          <div className="space-y-4">
            <DetailItem
              icon={<IoCheckmark className="w-4 h-4" />}
              label="Passing Score"
              value={`${assessment.passingScore} points`}
            />

            <DetailItem
              icon={<IoDocument className="w-4 h-4" />}
              label="Total Pages"
              value={assessment.pages.length.toString()}
            />

            <DetailItem
              icon={<IoTime className="w-4 h-4" />}
              label="Time Limit"
              value={
                assessment.timeLimit
                  ? `${assessment.timeLimit} minutes`
                  : "No limit"
              }
            />

            {assessment.description && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <div className="flex items-start space-x-3">
                  <IoInformation className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                    {assessment.description}
                  </p>
                </div>
              </div>
            )}

            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800">
              <div className="flex items-start space-x-3">
                <IoInformation className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">
                    Instructions
                  </h4>
                  <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1.5">
                    <li className="flex items-start space-x-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      <span>
                        Answer all questions to the best of your ability
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      <span>You cannot return after submitting</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      <span>Assessment auto-submits when time expires</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      <span>
                        Exiting will automatically submit your answers
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* desktop: floating sidebar card */}
      <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-sm shadow-sm border border-white dark:border-gray-700 max-h-[calc(100vh-12rem)] overflow-y-auto">
        <div className="p-5 border-b border-gray-100 dark:border-gray-600 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <IoInformation className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span>Assessment Details</span>
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Close details"
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <DetailItem
            icon={<IoCheckmark className="w-4 h-4" />}
            label="Passing Score"
            value={`${assessment.passingScore} points`}
          />

          <DetailItem
            icon={<IoDocument className="w-4 h-4" />}
            label="Total Pages"
            value={assessment.pages.length.toString()}
          />

          <DetailItem
            icon={<IoTime className="w-4 h-4" />}
            label="Time Limit"
            value={
              assessment.timeLimit
                ? `${assessment.timeLimit} minutes`
                : "No limit"
            }
          />

          {assessment.description && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
              <div className="flex items-start space-x-3">
                <IoInformation className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                  {assessment.description}
                </p>
              </div>
            </div>
          )}

          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800">
            <div className="flex items-start space-x-3">
              <IoInformation className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">
                  Instructions
                </h4>
                <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1.5">
                  <li className="flex items-start space-x-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>
                      Answer all questions to the best of your ability
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>You cannot return after submitting</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>Assessment auto-submits when time expires</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>Exiting will automatically submit your answers</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
