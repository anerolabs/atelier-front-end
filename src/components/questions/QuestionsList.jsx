import React from 'react';
import Question from './Question.jsx';

const QuestionsList = ({ questions, handleYesQuestionClick}) => {

  const filteredQuestions = questions.filter((question) => question.isVisible)

  return (
    <div id='questions-list-component'>
      {
        filteredQuestions.map((question) => {
          return (
            <Question
              key={question.question_id}
              question={question}
              handleYesQuestionClick={handleYesQuestionClick}
            />
          )
        })
      }
    </div>
  )

};

export default QuestionsList;