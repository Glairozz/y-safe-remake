import Seo from '../components/Seo';
import LessonsPage from '../components/lessons/LessonsPage';
import { lessons } from '../data/firstaid';
import { mainLessonQuiz } from '../data/firstaidQuiz';
import { lessonVideos } from '../data/firstaidVideos';

export default function FirstAidPage() {
  return (
    <>
      <Seo
        title="First Aid Tutorials - Y-Safe"
        description="Learn essential first aid skills such as treating wounds and burns, bandaging, and making arm slings."
        noindex
      />
      <LessonsPage
        pageTitle="First Aid Tutorial"
        pageDescription="Immediate care for injuries and everyday emergencies"
        intro="First aid is the immediate care given to a person who is injured or suddenly ill before professional medical help arrives. These lessons cover bandaging techniques, wound care, burns, and arm slings."
        quizType="first-aid"
        lessons={lessons}
        quizTitle={mainLessonQuiz.firstAid.title}
        quizQuestions={mainLessonQuiz.firstAid.questions}
        videoMap={lessonVideos}
      />
    </>
  );
}
