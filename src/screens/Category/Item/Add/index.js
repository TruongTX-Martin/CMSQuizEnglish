import React, { Component } from 'react';
import firebase from 'firebase';
import Input from '../../../../components/Input';
import Button from '../../../../components/Button';
import $ from 'jquery'
import axios from 'axios';
import './index.css';

export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryName: '',
      childId: '',
      itemId: '',
      type: '',
      title: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Input title item'
        },
        value: ''
      },
      url: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Input url file'
        },
        value: ''
      },
      listTranscript: [],
      listQuestion: []
    };
    this.database = firebase.database();
    this.addItem = this.addItem.bind(this);
    this.addTranscript = this.addTranscript.bind(this);
    this.addQuestion = this.addQuestion.bind(this);
    this.addAnswer = this.addAnswer.bind(this);
  }

  componentDidMount() {
    if (
      this.props.location.query &&
      this.props.location.query.type === 'update'
    ) {
      this.state.itemId = this.props.match.params.childId;
      this.state.type = 'update';
      this.state.childId = this.props.location.query.childId;
      this.getItemName();
    } else {
      this.state.childId = this.props.match.params.childId;
      this.getCategoryName();
    }
  }

  getItemName() {
    this.database
      .ref('item')
      .child(this.state.itemId)
      .on('value', snapshot => {
        if (snapshot.val()) {
          console.log('Val value:', snapshot.val().questions);
          //Add transcript
          let arrTranscript = [];
          if (snapshot.val().transcripts.length > 0) {
            const transript = snapshot.val().transcripts;
            for (let i = 0; i < transript.length; i++) {
              const item = {
                name: {
                  elementType: 'input',
                  elementConfig: {
                    type: 'text',
                    placeholder: 'Input name'
                  },
                  value: transript[i].name
                },
                content: {
                  elementType: 'input',
                  elementConfig: {
                    type: 'text',
                    placeholder: 'Input content'
                  },
                  value: transript[i].content
                }
              };
              arrTranscript.push(item);
            }
          }
          //add question
          let arrayQuestion = [];
          if (snapshot.val().questions.length > 0) {
            const questions = snapshot.val().questions;
            for (let i = 0; i < questions.length; i++) {
              let itemQuestion = questions[i];
              let arrayAnswer = [];
              for (let j = 0; j < itemQuestion.answers.length; j++) {
                let itemAnswer = itemQuestion.answers[j];
                const newItemAnswer = {
                  key: {
                    elementType: 'input',
                    elementConfig: {
                      type: 'text',
                      placeholder: 'Input Key'
                    },
                    value: itemAnswer.key
                  },
                  value: {
                    elementType: 'input',
                    elementConfig: {
                      type: 'text',
                      placeholder: 'Input Value'
                    },
                    value: itemAnswer.value
                  },
                  checked: itemAnswer.checked
                };
                arrayAnswer.push(newItemAnswer);
              }
              const newItem = {
                question: {
                  elementType: 'input',
                  elementConfig: {
                    type: 'text',
                    placeholder: 'Input question'
                  },
                  value: itemQuestion.question
                },
                answers: arrayAnswer
              };
              arrayQuestion.push(newItem);
            }
          }

          this.setState({
            categoryName: snapshot.val().title,
            title: {
              ...this.state.title,
              value: snapshot.val().title
            },
            url: {
              ...this.state.title,
              value: snapshot.val().url
            },
            listTranscript: arrTranscript,
            listQuestion: arrayQuestion
          });
        }
      });
  }q

  getCategoryName() {
    this.database
      .ref('childCategory')
      .child(this.state.childId)
      .on('value', snapshot => {
        if (snapshot.val()) {
          this.setState({ categoryName: snapshot.val().title });
        }
      });
  }

  isChoosedAnswers(array) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].checked) {
        return true;
      }
    }
    return false;
  }

  addItem() {
    if (
      this.state.title.value.length === 0 ||
      this.state.url.value.length === 0
    ) {
      alert('Please input');
      return;
    }
    if (this.state.listTranscript.length === 0) {
      alert('Please add transcript');
      return;
    }
    for (let i = 0; i < this.state.listTranscript.length; i++) {
      if (
        this.state.listTranscript[i].name.value.length === 0 ||
        this.state.listTranscript[i].content.value.length === 0
      ) {
        alert('Please input all transcript');
        return;
      }
    }

    if (this.state.listQuestion.length === 0) {
      alert('Please add question');
      return;
    }
    for (let i = 0; i < this.state.listQuestion.length; i++) {
      const item = this.state.listQuestion[i];
      if (item.question.value.length < 1) {
        alert('Please input all question');
        return;
      }
      if (item.answers.length < 2) {
        alert('Please add more than 2 answer');
        return;
      }

      if (!this.isChoosedAnswers(item.answers)) {
        alert('Please select at leats one answer!');
        return;
      }

      for (let j = 0; j < item.answers.length; j++) {
        const answerItem = item.answers[j];
        if (
          answerItem.key.value.length < 1 ||
          answerItem.value.value.length < 1
        ) {
          alert('Please input all answers');
          return;
        }
      }
    }
    const transcripts = [];
    for (let i = 0; i < this.state.listTranscript; i++) {
      const item = this.state.listTranscript[i];
      const itemTranscript = {
        name: item.name.value,
        content: item.content.value
      };
      transcripts.push(itemTranscript);
    }
    const answers = [];
    for (let i = 0; i < this.state.listAnswers; i++) {
      const item = this.state.listAnswers[i];
      const itemAnswer = {
        key: item.key.value,
        value: item.value.value,
        checked: item.checked
      };
      answers.push(itemAnswer);
    }

    let arrTranscript = [];
    for (let i = 0; i < this.state.listTranscript.length; i++) {
      const itemTrans = this.state.listTranscript[i];
      let item = {
        name: itemTrans.name.value,
        content: itemTrans.content.value
      };
      arrTranscript.push(item);
    }

    let arrQuestion = [];

    for (let i = 0; i < this.state.listQuestion.length; i++) {
      const itemQuestion = this.state.listQuestion[i];
      let arrAns = [];
      for (let j = 0; j < itemQuestion.answers.length; j++) {
        arrAns.push({
          key: itemQuestion.answers[j].key.value,
          value: itemQuestion.answers[j].value.value,
          checked: itemQuestion.answers[j].checked
        });
      }
      let newQuestion = {
        question: itemQuestion.question.value,
        answers: arrAns
      };
      arrQuestion.push(newQuestion);
    }
    let itemConversation = {
      childCategoryId: this.state.childId,
      title: this.state.title.value,
      url: this.state.url.value,
      transcripts: arrTranscript,
      questions: arrQuestion
    };

    if(this.state.type === 'update') {
      this.database
      .ref('item')
      .child(this.state.itemId)
      .set(itemConversation)
    }else{
      this.database
      .ref('item')
      .push()
      .update(itemConversation);
    }
    this.props.history.goBack();
  }


  addTranscript() {
    const item = {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Input name'
        },
        value: ''
      },
      content: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Input content'
        },
        value: ''
      }
    };
    const arr = this.state.listTranscript;
    arr.push(item);
    this.setState({
      listTranscript: arr
    });
  }

  onChangeHandleName = (index, event) => {
    const arr = this.state.listTranscript;
    arr[index].name.value = event.target.value;
    this.setState({ listTranscript: arr });
  };

  onChangeHandleContent = (index, event) => {
    const arr = this.state.listTranscript;
    arr[index].content.value = event.target.value;
    this.setState({ listTranscript: arr });
  };

  onChangeHandleAnswerKey = (index, indexAnswer, event) => {
    const arr = this.state.listQuestion;
    arr[index].answers[indexAnswer].key.value = event.target.value;
    this.setState({ listQuestion: arr });
  };

  onChangeHandleAnswerValue = (index, indexAnswer, event) => {
    const arr = this.state.listQuestion;
    arr[index].answers[indexAnswer].value.value = event.target.value;
    this.setState({ listQuestion: arr });
  };

  onCheckChange = (index, indexAnswer, event) => {
    const arr = this.state.listQuestion;
    const item = arr[index];
    for (let i = 0; i < item.answers.length; i++) {
      if (i === indexAnswer) {
        item.answers[i].checked = event.target.checked;
      } else {
        item.answers[i].checked = !event.target.checked;
      }
    }
    this.setState({ listQuestion: arr });
  };

  addAnswer(index) {
    const item = {
      key: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Input Key'
        },
        value: ''
      },
      value: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Input Value'
        },
        value: ''
      },
      checked: false
    };
    const arr = this.state.listQuestion;
    arr[index].answers.push(item);
    this.setState({
      listQuestion: arr
    });
  }

  addQuestion() {
    const arrQuestion = this.state.listQuestion;
    const newItem = {
      question: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Input question'
        },
        value: ''
      },
      answers: []
    };
    arrQuestion.push(newItem);
    this.setState({ listQuestion: arrQuestion });
  }

  onChangeQuestionValue = (index, event) => {
    const arr = this.state.listQuestion;
    arr[index].question.value = event.target.value;
    this.setState({ listQuestion: arr });
  };

  onClickDeleteTranscriptItem(index) {
    const listTranscript = this.state.listTranscript;
    listTranscript.splice(index,1);
    this.setState({ listTranscript });
  }

  onDeleteAnswersItem(index,indexAnswer) {
    console.log('List question:', this.state.listQuestion);
    console.log('Delete answers item:', index, ', indexansers:', indexAnswer);
    const listQuestion = this.state.listQuestion;
    const itemQuestion = listQuestion[index];
    const answers = itemQuestion.answers;
    answers.splice(indexAnswer,1);
    itemQuestion.answers = answers;
    listQuestion[index] = itemQuestion;
    this.setState({
      listQuestion
    });
  }

  deleteQuestionItm(index){
    const listQuestion = this.state.listQuestion;
    listQuestion.splice(index,1);
    this.setState({ listQuestion });
  }

  render() {
    return (
      <div>
        <h2>{this.state.categoryName}</h2>
        <Input
          elementType={this.state.title.elementType}
          elementConfig={this.state.title.elementConfig}
          value={this.state.title.value}
          changed={event =>
            this.setState({
              title: {
                ...this.state.title,
                value: event.target.value
              }
            })
          }
        />
        <Input
          elementType={this.state.url.elementType}
          elementConfig={this.state.url.elementConfig}
          value={this.state.url.value}
          changed={event =>
            this.setState({
              url: {
                ...this.state.url,
                value: event.target.value
              }
            })
          }
        />
        <div className="Transcript">
          {this.state.listTranscript.map((item, index) => (
            <div className="TranscriptItem">
              <div className="TranscriptItemLeft">
                <Input
                  elementType={item.name.elementType}
                  elementConfig={item.name.elementConfig}
                  value={item.name.value}
                  changed={event => this.onChangeHandleName(index, event)}
                />
                <Input
                  elementType={item.content.elementType}
                  elementConfig={item.content.elementConfig}
                  value={item.content.value}
                  changed={event => this.onChangeHandleContent(index, event)}
                />
              </div>
              <div className="TranscriptItemRight">
                <p onClick={() => this.onClickDeleteTranscriptItem(index)}>Delete</p>
              </div>
            </div>
          ))}
           <Button onClicked={this.addTranscript}>Add Transcripts</Button>
        </div>

        {this.state.listQuestion.map((item, index) => (
          <div className="Question">
            <h4 style={{ marginTop: 0, marginBottom: 0}}>Question{index + 1}</h4>
            <p className="delete-question" onClick={() => this.deleteQuestionItm(index)}>Delete</p>
            <Input
              elementType={item.question.elementType}
              elementConfig={item.question.elementConfig}
              value={item.question.value}
              changed={event => this.onChangeQuestionValue(index, event)}
            />
            {item.answers.map((itemAns, indexAnswer) => (
              <div className="TranscriptItem">
                <div className="TranscriptItemLeft">
                <input
                  type="checkbox"
                  checked={itemAns.checked}
                  onChange={event =>
                    this.onCheckChange(index, indexAnswer, event)
                  }
                />
                <Input
                  elementType={itemAns.key.elementType}
                  elementConfig={itemAns.key.elementConfig}
                  value={itemAns.key.value}
                  changed={event =>
                    this.onChangeHandleAnswerKey(index, indexAnswer, event)
                  }
                />
                <Input
                  elementType={itemAns.value.elementType}
                  elementConfig={itemAns.value.elementConfig}
                  value={itemAns.value.value}
                  changed={event =>
                    this.onChangeHandleAnswerValue(index, indexAnswer, event)
                  }
                />
                </div>
                <div className="TranscriptItemRight">
                  <p onClick={() => this.onDeleteAnswersItem(index,indexAnswer)}>Delete</p>
                </div>
              </div>
            ))}
            <Button onClicked={() => this.addAnswer(index)}>Add Answers</Button>
          </div>
        ))}
        <Button 
        // onClicked={this.addQuestion}
        >Add Question</Button>
        <Button 
        // onClicked={this.addItem}
        >
          {this.state.type === 'update' ? 'Submit Edit' : 'Add Item'}
        </Button>
      </div>
    );
  }
}
