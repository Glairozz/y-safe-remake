import LessonsPage from '../components/lessons/LessonsPage';
import { essentials, mainLessonQuiz } from '../data/essentials';

export default function EssentialsPage() {
  return (
    <LessonsPage
      pageTitle="First Aid Essentials"
      pageDescription="Why it is important to have first aid essentials"
      intro="Having first aid essentials means you are ready to give immediate help in an emergency or disaster while waiting for professional assistance."
      quizType="essentials"
      lessons={essentials}
      quizTitle={mainLessonQuiz.essentials.title}
      quizQuestions={mainLessonQuiz.essentials.questions}
    />
  );
}
