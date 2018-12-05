class Experience {
    constructor(state, action, reward, next_state) {
        this.state = state;
        this.action = action;
        this.reward = reward;
        this.state2 = next_state;
    }
}