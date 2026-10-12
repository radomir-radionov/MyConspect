import assert from "node:assert/strict";
import test from "node:test";
import {
  behaviorPageTitle,
  behaviorQuestionTitle,
  behaviorSlotLabel,
} from "./behaviorQuestions";

test("behaviorQuestionTitle returns Russian for known questions", () => {
  assert.equal(
    behaviorQuestionTitle("ru", "What are your greatest strengths?"),
    "Какие ваши главные сильные стороны?",
  );
  assert.equal(
    behaviorQuestionTitle("en", "What are your greatest strengths?"),
    "What are your greatest strengths?",
  );
});

test("behaviorSlotLabel returns Russian slot headings", () => {
  assert.equal(behaviorSlotLabel("ru", "key"), "Ключ");
  assert.equal(behaviorSlotLabel("ru", "advices"), "Советы");
  assert.equal(behaviorSlotLabel("ru", "traps"), "Ловушки");
  assert.equal(behaviorSlotLabel("en", "key"), undefined);
});

test("behaviorPageTitle localizes page heading", () => {
  assert.equal(
    behaviorPageTitle("ru", "Behavior questions"),
    "Поведенческие вопросы",
  );
});
