import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaDownload,
  FaCheck,
  FaFileAlt,
  FaShieldAlt,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

interface TermsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TermsModal({ open, onOpenChange }: TermsModalProps) {
  const downloadUrl =
    "https://github.com/jeru7/MathPath-Web/releases/download/MathPath-10_v1.0.0/Math-Path10.apk";

  const [currentStep, setCurrentStep] = useState(0);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      id: 0,
      title: "Terms",
      subtitle: "Terms & Conditions",
      icon: <FaFileAlt className="text-sm" />,
    },
    {
      id: 1,
      title: "Privacy",
      subtitle: "Privacy Policy",
      icon: <FaShieldAlt className="text-sm" />,
    },
    {
      id: 2,
      title: "Download",
      subtitle: "Ready to Download",
      icon: <FaDownload className="text-sm" />,
    },
  ];

  // Auto-scroll to top when step changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep]);

  useEffect(() => {
    if (!open) {
      // Reset state when modal closes
      setTimeout(() => {
        setCurrentStep(0);
        setAcceptedTerms(false);
        setAcceptedPrivacy(false);
      }, 300);
    }
  }, [open]);

  const handleAcceptTerms = () => {
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "Math-Path10.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onOpenChange(false);
  };

  const handleDeclineTerms = () => {
    onOpenChange(false);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed =
    (currentStep === 0 && acceptedTerms) ||
    (currentStep === 1 && acceptedPrivacy) ||
    currentStep === 2;

  const canDownload = acceptedTerms && acceptedPrivacy;

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#19191c] border-none md:border border-[#737373] w-[100dvw] h-[100dvh] max-w-none md:max-w-2xl md:max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-none md:rounded-lg">
        <DialogHeader className="flex-row items-center justify-between p-4 md:p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-green-400/20 rounded-lg">
              {steps[currentStep].icon}
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-green-400">
                {steps[currentStep].subtitle}
              </h3>
            </div>
          </div>
        </DialogHeader>

        {/* Enhanced Stepper */}
        <div className="px-4 md:px-6 pt-4 pb-2">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="flex items-center flex-1 last:flex-none"
              >
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${currentStep >= step.id
                        ? "bg-green-400 border-green-400 text-white shadow-lg shadow-green-400/25"
                        : "border-gray-500 text-gray-500 bg-gray-800"
                      }`}
                  >
                    {currentStep > step.id ? (
                      <FaCheck className="text-sm" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium text-center max-w-16 ${currentStep >= step.id
                        ? "text-green-400"
                        : "text-gray-500"
                      }`}
                  >
                    {step.title}
                  </span>
                </div>

                {index < steps.length - 1 && (
                  <div className="flex-1 mx-2 relative">
                    <div className="h-1 bg-gray-600 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-green-400"
                        initial={{ width: 0 }}
                        animate={{
                          width: currentStep > step.id ? "100%" : "0%",
                        }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto px-4 md:px-6 pb-4"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={stepVariants}
              transition={{ duration: 0.2 }}
              className="text-gray-300 space-y-4"
            >
              {currentStep === 0 && (
                <div className="space-y-4 text-sm">
                  <p>
                    These Terms and Conditions constitute a legally binding
                    agreement made between you and us concerning your access to
                    and use of mathpath.site and the Math-Path 10 mobile game.
                  </p>
                  <p>
                    You agree that by using the website or playing the game, you
                    have read, understood, and agree to be bound by all of these
                    Terms and Conditions. If you do not agree with all of these
                    Terms and Conditions, then you are expressly prohibited from
                    using Math-Path 10.
                  </p>
                  <p>
                    We will alert you about any changes by updating the "Last
                    Updated" date of these Terms and Conditions. It is your
                    responsibility to periodically review these to stay informed
                    of updates.
                  </p>
                  <h4 className="font-bold text-white mt-4">
                    Who Can Use Math-Path 10
                  </h4>
                  <p>
                    Math-Path 10 is intended for grade 10 students of Probex
                    Inc. who are at least 13 years of age. All users who are
                    minors (generally under the age of 18) must have their
                    parent, guardian, or teachers read and agree to these Terms
                    and Conditions prior to you using the website and the mobile
                    game. You agree to use Math-Path 10 responsibly and for
                    educational purposes only.
                  </p>
                  <h4 className="font-bold text-white mt-4">
                    Accounts and Access
                  </h4>
                  <p>
                    The Math-Path 10 website and mobile game requires you to
                    create an account to track your progress and save your
                    scores. You agree to use accurate and school-appropriate
                    information when creating your account. Keep your login
                    details private as you are responsible for any actions done
                    under your account.
                  </p>
                  <h4 className="font-bold text-white mt-4">
                    Learning Content and Game Use
                  </h4>
                  <p>
                    The questions provided inside the game are based on Global
                    Mathematics 10 (3rd Edition) by The Library Publishing
                    House, Inc. All in-game content (such as characters,
                    graphics, and storyline voiceovers) belongs to Math-Path 10.
                    You may use the materials for personal study only. Copying,
                    redistributing, or recording content for external use is not
                    allowed.
                  </p>
                  <h4 className="font-bold text-white mt-4">Student Conduct</h4>
                  <p className="font-medium text-gray-200 mb-3">
                    You agree not to:
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-1.5 h-1.5 bg-gray-300 rounded-full mt-2"></div>
                      <p className="text-gray-300 text-sm">
                        Cheat on assessments or tamper with game scores
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-1.5 h-1.5 bg-gray-300 rounded-full mt-2"></div>
                      <p className="text-gray-300 text-sm">
                        Use rude, offensive, or harmful language
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-1.5 h-1.5 bg-gray-300 rounded-full mt-2"></div>
                      <p className="text-gray-300 text-sm">
                        Try to hack, damage, or interfere with the website or
                        game
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-red-400/10 border border-red-400/20 rounded-lg">
                    <p className="text-red-300 text-sm font-medium">
                      If you break these rules, we may suspend or delete your
                      account.
                    </p>
                  </div>
                  <h4 className="font-bold text-white mt-4">
                    Learning Results
                  </h4>
                  <p>
                    The Math-Path 10 website and mobile game are tools to help
                    you practice and learn. We do our best to make the contents
                    accurate and helpful, but we do not guarantee specific
                    grades or results in school.
                  </p>
                  <h4 className="font-bold text-white mt-4">
                    Privacy and Safety
                  </h4>
                  <p>
                    Your safety and privacy are very important to us. We only
                    collect the information needed to make your learning
                    experience work properly.
                  </p>
                  <h4 className="font-bold text-white mt-4">Contact Us</h4>
                  <p>
                    Should you have any concern or question regarding this
                    Privacy Policy, you may contact: mathpath.44@gmail.com
                  </p>
                  <div className="flex items-center space-x-3 mt-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                    <Checkbox
                      id="accept-terms"
                      checked={acceptedTerms}
                      onCheckedChange={(checked) =>
                        setAcceptedTerms(checked as boolean)
                      }
                      className="text-green-400 border-gray-600 data-[state=checked]:bg-green-400 data-[state=checked]:border-green-400 mt-0.5"
                    />
                    <label
                      htmlFor="accept-terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1"
                    >
                      I have read and agree to the Terms and Conditions
                    </label>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-4 text-sm">
                  <p>
                    We respect everyone's right to privacy and are committed to
                    handling all personal data responsibly and lawfully. We
                    follow the Data Privacy Act of 2012 (DPA) and other related
                    laws to protect your information. This Data Privacy Policy
                    explains what personal information we collect, why we
                    collect it, and how we use and protect it.
                  </p>

                  <h4 className="font-bold text-white mt-4">
                    What Information Do We Collect?
                  </h4>
                  <p>
                    We collect personal information that you provide to us when
                    using Math-Path 10: Your name and username Email address and
                    LRN Grade Level Gender Game progress, scores, and
                    achievements
                  </p>

                  <h4 className="font-bold text-white mt-4">
                    How Do We Use Your Information?
                  </h4>
                  <p>
                    We use your information to: Support and improve learning
                    experiences for educational purposes Facilitate account
                    creation and authentication Track student progress and
                    performance
                  </p>

                  <h4 className="font-bold text-white mt-4">Data Privacy</h4>
                  <p>
                    We use secure servers and data encryption to protect your
                    information. Only authorized teachers, school
                    administrators, or developers have access to student data
                    when necessary for educational purposes.
                  </p>

                  <h4 className="font-bold text-white mt-4">
                    Information Selling
                  </h4>
                  <p>
                    We do not sell, trade, or share your personal information
                    with anyone outside the Math-Path 10 development team and
                    Probex School. Information is only shared when required by
                    law or to maintain system security.
                  </p>

                  <h4 className="font-bold text-white mt-4">
                    Your Rights with Respect to Your Personal Data
                  </h4>
                  <p>
                    We recognize your rights with respect to your personal data
                    as provided by the DPA. Should you decide to exercise any of
                    these, we will consider your action and address the same in
                    accordance with the law.
                  </p>

                  <h4 className="font-bold text-white mt-4">
                    Updates to This Policy
                  </h4>
                  <p>
                    We may make changes to this Privacy Policy without explicit
                    prior notice. On such occasions, the updated version will be
                    indicated by the "Last Updated" date of this Privacy Policy.
                    You are advised to visit our website from time to time for
                    any changes. Changes are effective immediately upon posting
                    on the website.
                  </p>

                  <h4 className="font-bold text-white mt-4">Contact Us</h4>
                  <p>
                    Should you have any concern or question regarding this
                    Privacy Policy, you may contact: mathpath.44@gmail.com
                  </p>

                  <div className="flex items-center space-x-3 mt-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                    <Checkbox
                      id="accept-privacy"
                      checked={acceptedPrivacy}
                      onCheckedChange={(checked) =>
                        setAcceptedPrivacy(checked as boolean)
                      }
                      className="text-green-400 border-gray-600 data-[state=checked]:bg-green-400 data-[state=checked]:border-green-400 mt-0.5"
                    />
                    <label
                      htmlFor="accept-privacy"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1"
                    >
                      I have read and agree to the Privacy Policy
                    </label>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5, delay: 0.2 }}
                    className="w-20 h-20 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-400/25"
                  >
                    <FaCheck className="text-3xl text-white" />
                  </motion.div>
                  <motion.h4
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="text-2xl font-bold text-green-400 mb-3"
                  >
                    Ready to Download!
                  </motion.h4>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="text-gray-300 text-lg mb-2"
                  >
                    Thank you for reviewing our Terms and Privacy Policy.
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                    className="text-gray-400"
                  >
                    You can now download Math-Path 10 and start your learning
                    journey.
                  </motion.p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex gap-3 p-4 md:p-6 border-t bg-[#19191c] ">
          {currentStep > 0 ? (
            <Button
              onClick={handleBack}
              variant="outline"
              className="flex items-center gap-2 flex-1 md:flex-none md:px-6 border-gray-600 text-white hover:bg-gray-700"
            >
              <FaChevronLeft className="text-sm" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          ) : (
            <Button
              onClick={handleDeclineTerms}
              variant="outline"
              className="flex-1 md:flex-none md:px-6 border-gray-600 text-white hover:bg-gray-700"
            >
              Cancel
            </Button>
          )}

          <div className="flex-1" />

          {currentStep < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="flex items-center gap-2 flex-1 md:flex-none md:px-6 bg-green-400 hover:bg-green-500 text-white disabled:bg-gray-600 disabled:text-gray-400"
            >
              <span className="hidden sm:inline">Next</span>
              <FaChevronRight className="text-sm" />
            </Button>
          ) : (
            <Button
              onClick={handleAcceptTerms}
              disabled={!canDownload}
              className="flex items-center gap-2 flex-1 md:flex-none md:px-6 bg-green-400 hover:bg-green-500 text-white disabled:bg-gray-600 disabled:text-gray-400"
            >
              <FaDownload className="text-sm" />
              Download Now
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
