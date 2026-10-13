import Seo from '../components/Seo';
import LessonsPage from '../components/lessons/LessonsPage';
import { essentials, mainLessonQuiz } from '../data/essentials';

export default function EssentialsPage() {
  return (
    <>
      <Seo
        title="First Aid Essentials - Y-Safe"
        description="Discover the first aid essentials every household should keep ready for emergencies and disasters."
        noindex
      />
      <LessonsPage
        pageTitle="First Aid Essentials"
        pageDescription="Why it is important to have first aid essentials"
        intro="Having first aid essentials means you are ready to give immediate help in an emergency or disaster while waiting for professional assistance."
        quizType="essentials"
        lessons={essentials}
        quizTitle={mainLessonQuiz.essentials.title}
        quizQuestions={mainLessonQuiz.essentials.questions}
      />
    </>
  );
}
