questionTypeContent =
<div className="questionTypeContainer">
  <TextField
    required
    autoFocus
    margin="dense"
    fullWidth
    id="questionText"
    defaultValue={this.task.question}
    placeholder="What is your favorite colour? What is thy quest? What is the air speed velocity of a Swallow? What do you mean? Is it an African Swallow or a European Swallow?"
    label="Question"
    ref="questionTextRef"
    multiline
    rows="3"
    onChange={(e)=>{this.task.question = e.target.value}}
  />

  {questionResponseType}

  <TextField
    required
    autoFocus
    margin="dense"
    style={{marginRight:"10px", width:"48%"}}
    id="responses"
    defaultValue={this.task.responses.join(',')}
    placeholder="Arrrrrghhhhh, Castle Arrrrrghhh"
    helperText="Question responses seperated by a comma"
    label="Responses"
    ref="responsesRef"
    onChange={(e)=> this.responseHandler(e, e.target.value, "Responses")}
  />
  <TextField
    autoFocus
    margin="dense"
    style={{width:"48%"}}
    id="unit"
    defaultValue={this.task.responseUnit}
    placeholder="%"
    helperText="The unit of the responses if they are numerical"
    label="Unit"
    ref="unitRef"
    onChange={(e)=> this.task.responseUnit = e.target.value}
  />
  <TextField
    required
    autoFocus
    margin="dense"
    style={{marginRight:"10px", width:"48%"}}
    id="tags"
    defaultValue={this.task.correctResponses.join(',')}
    placeholder="What do you mean? Is it an African swallow or a European swallow?"
    helperText="The correct answer to the question"
    label="Correct Answers"
    ref="answerRef"
    onChange={(e)=> this.responseHandler(e, e.target.value, "Answers")}
  />
  <TextField
    required
    autoFocus
    margin="dense"
    style={{width:"48%"}}
    id="tags"
    defaultValue={this.task.tags.join(',')}
    placeholder="SillyWalks, Swallows"
    helperText="Tags seperated by a comma"
    label="Tags"
    ref="tagsRef"
    onChange={(e)=> this.responseHandler(e, e.target.value, "Tags")}
  />
  <TextField
    autoFocus
    margin="dense"
    style={{width:"calc(96% + 10px)"}}
    id="aoisText"
    defaultValue={this.task.aois.join(',')}
    placeholder="Screen A, Screen B"
    helperText="AOIs seperated by a comma"
    label="AOIs"
    ref="aoisTextRef"
    fullWidth
    onChange={(e)=> this.responseHandler(e, e.target.value, "AOIs")}
  />
  </div>;
}
