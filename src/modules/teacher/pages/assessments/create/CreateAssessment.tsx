import { useEffect, useState, type ReactElement } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "../../../../core/styles/customDatePopper.css";
import Stepper from "./components/Stepper";
import PageCard from "./components/PageCard";
import Actions from "./components/Actions";
import AddQuestionModal from "./add-question/AddQuestionModal";
import {
  AssessmentContent,
  AssessmentPage,
  AssessmentQuestion,
} from "../../../../core/types/assessment/assessment.types";
import { nanoid } from "nanoid";

export default function CreateAssessment(): ReactElement {
  // states
  const [showAddQuestion, setShowAddQuestion] = useState<boolean>(false);
  const [pages, setPages] = useState<AssessmentPage[]>([
    { id: nanoid(), title: "Page 1", contents: [] },
  ]);
  const [selectedPageId, setSelectedPageId] = useState<string>(pages[0].id);

  let currentQuestionNumber = 0;

  useEffect(() => {
    console.log(pages);
  }, [pages]);

  // handlers
  const handleAddQuestion = (pageId: string, question: AssessmentQuestion) => {
    setPages((prevPages) => {
      const newPages = [...prevPages];

      newPages.map((page) => {
        if (page.id === pageId) {
          page.contents.push({
            id: nanoid(),
            type: "question",
            data: question,
          });
        }
      });

      return newPages;
    });
  };

  const handlePageContentChanges = (
    pageId: string,
    newContents: AssessmentContent[],
  ) => {
    setPages((prevPages) =>
      prevPages.map((page) =>
        pageId === page.id ? { ...page, contents: newContents } : page,
      ),
    );
  };

  const handleAddPage = (page: AssessmentPage) => {
    setPages([...pages, page]);
  };

  return (
    <main className="flex h-fit w-full flex-col gap-2 bg-inherit p-4 min-h-full">
      <header className="flex w-full items-center justify-between py-1">
        <h3 className="text-2xl font-bold">Create Assessment</h3>
      </header>

      <div className="flex h-fit flex-col min-h-full">
        <section className="flex justify-center relative">
          <button className="absolute py-1 px-4 border rounded-sm left-0 top-1/2 -translate-y-1/2">
            <p>Back</p>
          </button>
          <Stepper currentStep={1} />
        </section>
        <section className="bg-white shadow-sm rounded-sm px-96 py-12 flex flex-col gap-4 h-fit min-h-full">
          {/* TODO: make pages draggable */}
          {/* page list */}
          {pages.map((page) => {
            const questionCountInPage = page.contents.filter(
              (content) => content.type === "question",
            ).length;
            const startingNumber = currentQuestionNumber + 1;

            const pageCard = (
              <PageCard
                key={page.id}
                page={page}
                startingQuestionNumber={startingNumber}
                onShowAddQuestion={() => {
                  setSelectedPageId(page.id);
                  setShowAddQuestion(true);
                }}
                onContentsChange={handlePageContentChanges}
              />
            );

            currentQuestionNumber += questionCountInPage;

            return pageCard;
          })}
          <Actions onAddPage={handleAddPage} pageCount={pages.length} />
        </section>
      </div>

      {/* add question modal */}
      {showAddQuestion && (
        <AddQuestionModal
          setShowAddQuestion={setShowAddQuestion}
          onAddQuestion={handleAddQuestion}
          pageId={selectedPageId}
        />
      )}
    </main>
  );
}
