import LessonsPage from '../components/lessons/LessonsPage';
import { lessons, mainLessonQuiz } from '../data/safety';

export default function SafetyPage() {
  return (
    <LessonsPage
      pageTitle="Safety Awareness"
      pageDescription="Why being aware of risks can save lives"
      intro="Being aware of risks helps people recognize danger early and take the right action before an accident becomes serious. Review each topic below, then unlock the quiz."
      quizType="safety"
      lessons={lessons}
      quizTitle={mainLessonQuiz.safety.title}
      quizQuestions={mainLessonQuiz.safety.questions}
    />
  );
}
