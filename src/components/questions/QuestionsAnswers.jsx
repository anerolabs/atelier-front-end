import React from "react";
import axios from "axios";
import SearchBar from "./SearchBar.jsx";
import QuestionsList from "./QuestionsList.jsx";
import AddQuestionModal from "./modals/AddQuestionModal.jsx";
import API_KEY from "../../config";
import { getQuestions, postQuestion } from "../../utils/questionsUtils.js";

class QuestionsAnswers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questionsList: [],
    };
    this.filterQuestionsList = this.filterQuestionsList.bind(this);
    this.voteHelpfulQuestion = this.voteHelpfulQuestion.bind(this);
    this.loadMoreQuestions = this.loadMoreQuestions.bind(this);
    this.setTwoQuestionsVisable = this.setTwoQuestionsVisable.bind(this);
    this.toggleQuestionsModal = this.toggleQuestionsModal.bind(this);
    this.addQuestion = this.addQuestion.bind(this);
  }

  addQuestion(question) {

    const { productId } = this.props;

    postQuestion(question, productId)
      .then((res) => {
        if (res.status === 201) {
          getQuestions(productId)
            .then((response) => {
              const mappedQuestions = this.setTwoQuestionsVisable(response);
              this.setState({
                questionsList: mappedQuestions,
                view: "main",
              });
            })
            .catch((err) => {
              console.error("Error getting questions after posting one!", err);
            });
        }
      })
      .catch((error) => {
        console.error("Error posting one question!", err);
      });
  }

  toggleQuestionsModal(viewChange) {
    this.setState({
      questionsList: this.state.questionsList,
      view: viewChange,
    });
  }

  filterQuestionsList(term) {
    if (term.length >= 3) {
      const filteredList = this.state.questionsList.map((question) => {
        const questionBody = question.question_body.toLowerCase();
        const search = term.toLowerCase();
        if (questionBody.includes(search)) {
          question.isVisible = true;
          return question;
        } else {
          question.isVisible = false;
          return question;
        }
      });
      this.setState({ questionsList: filteredList });
    } else {
      const unfilteredList = this.setTwoQuestionsVisable(
        this.state.questionsList
      );
      this.setState({ questionsList: unfilteredList });
    }
  }

  voteHelpfulQuestion(questionToUpdate) {
    const newState = this.state.questionsList;
    const button = document.querySelector(
      `#vote-helpful-question-${questionToUpdate.question_id}`
    );

    if (!button.disable) {
      newState.forEach((question) => {
        if (questionToUpdate.question_id === question.question_id) {
          questionToUpdate.question_helpfulness += 1;
        }
      });
      this.setState({ questionsList: newState });
      button.disabled = true;
    }
  }

  loadMoreQuestions() {
    const button = document.querySelector('#load-question-button');

    if (button.innerHTML.includes('MORE QUESTIONS')) {
      button.innerHTML = 'LESS QUESTIONS';
      const entireQuestionList = this.state.questionsList.map((question) => {
        question.isVisible = true;
        return question;
      });
      this.setState({ questionsList: entireQuestionList });
    } else {
      button.innerHTML = 'MORE QUESTIONS';
      const unfilteredList = this.setTwoQuestionsVisable(
        this.state.questionsList
      );
      this.setState({ questionsList: unfilteredList });
    }
  }

  setTwoQuestionsVisable(array) {
    const twoSetVisable = array.map((question, idx) => {
      if (idx < 2) {
        question.isVisible = true;
        return question;
      } else {
        question.isVisible = false;
        return question;
      }
    });
    return twoSetVisable;
  }

  componentDidMount() {
    const { productId } = this.props;

    if (productId) {
      getQuestions(productId).then((response) => {
        const mappedQuestions = this.setTwoQuestionsVisable(response);
        this.setState({
          questionsList: mappedQuestions,
          view: "main",
        });
      });
    }
  }

  render() {
    const QuestionsAnswersComponent = (
      <div className="question-answers-container">
        <SearchBar filterQuestionsList={this.filterQuestionsList} />
        <QuestionsList
          questions={this.state.questionsList}
          handleYesQuestionClick={this.voteHelpfulQuestion}
          changeView={this.changeView}
        />
        <div className="button-container">
          {this.state.questionsList.length > 2 && (
            <button
              id="load-question-button"
              type="button"
              className="big-btn"
              onClick={(e) => {
                this.loadMoreQuestions();
              }}
            >
              {" "}
              MORE QUESTIONS
            </button>
          )}
          <button
            id="add-question-button"
            className="big-btn"
            type="button"
            onClick={() => {
              this.toggleQuestionsModal("AddQuestionModal");
            }}
          >
            {" "}
            ADD QUESTION
          </button>
        </div>
      </div>
    );

    switch (this.state.view) {
      case "AddQuestionModal":
        return (
          <>
            <AddQuestionModal
              productId={this.props.productId}
              toggleQuestionsModal={this.toggleQuestionsModal}
              addQuestion={this.addQuestion}
            />
            {QuestionsAnswersComponent}
          </>
        );

      default:
        return <>{QuestionsAnswersComponent}</>;
    }
  }
}

export default QuestionsAnswers;
