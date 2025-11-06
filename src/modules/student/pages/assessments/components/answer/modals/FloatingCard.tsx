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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../../../../components/ui/card";
import { Button } from "../../../../../../../components/ui/button";
import { Badge } from "../../../../../../../components/ui/badge";

type FloatingCardProps = {
  assessment: Assessment;
  onClose: () => void;
};

export function FloatingCard({
  assessment,
  onClose,
}: FloatingCardProps): ReactElement {
  return (
    <div className="fixed h-[100dvh] w-[100dvw] lg:absolute lg:top-6 lg:right-6 lg:w-80 z-50">
      {/* Mobile View */}
      <div className="lg:hidden fixed inset-0 bg-background z-50">
        <Card className="h-full rounded-none border-0 flex flex-col">
          <CardHeader className="border-b p-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-3">
                <Badge className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <IoInformation className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </Badge>
                <span>Assessment Details</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <IoClose className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          <div className="flex-1 overflow-y-auto p-4">
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
                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <IoInformation className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                        {assessment.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
              <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                <CardContent className="p-4">
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
                </CardContent>
              </Card>
            </div>
          </div>
        </Card>
      </div>

      {/* Desktop View */}
      <Card className="hidden lg:block max-h-[calc(100vh-12rem)]">
        <CardHeader className="border-b p-5">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3">
              <Badge className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <IoInformation className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </Badge>
              <span>Assessment Details</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <IoClose className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <div className="overflow-y-auto max-h-[calc(100vh-20rem)]">
          <CardContent className="p-5 space-y-4">
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
              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <IoInformation className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                      {assessment.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
            <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
              <CardContent className="p-4">
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
              </CardContent>
            </Card>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
