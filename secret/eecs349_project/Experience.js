class Experience {
    constructor(state, action, reward, next_state, done) {
        this.done = done;
        this.state = state;
        this.action = action;
        this.reward = reward;
        this.next_state = next_state;
    }
}