class FrameBuffer {
    constructor(num_frames, frame_skip){
        this.frames = new Array();
        this.actions = new Array();
        this.num_frames = num_frames;
        this.frame_skip = frame_skip;
        this.frame_count = 0;

    }
    initialize(frame){
        for (var i = 0; i < this.num_frames - 1; i++){
            this.frames.push(frame);
        }
        
    }

    add_frame(frame){
        this.frame_count++;
        if (this.frame_count % this.frame_skip == 0){
            this.frames.push(frame);
        }
        
    }

    add_action(action){
        if (this.frame_count % this.frame_skip == 0){
            this.actions.push(action);
        }
        
    }

    get_state(){
        var state = new Array();
        for (var i = this.frames.length - this.num_frames; i < this.frames.length; i++){
            state = state.concat(this.frames[i]);
        }
        return state;
    }

    get_state(){
        var state = new Array();
        for (var i = this.frames.length - this.num_frames; i < this.frames.length; i++){
            state = state.concat(this.frames[i]);
        }
        return state;
    }

    get_state_at(loc){
        var state = new Array();
        for (var i = loc; i < loc + this.num_frames; i++){
            state = state.concat(this.frames[i]);
        }
        return state;

    }

    get_experiences(){
        var experiences = new Array();
        for (var i = 0; i < this.actions.length - 1; i++)
        {
            var state = this.get_state_at(i);
            var state2 = this.get_state_at(i + 1);
            var state_len = state2.length;
            var action = this.actions[i];
            var reward = state[state_len - 12] + state2[state_len - 28] - state[state_len - 28] - state2[state_len - 12]
            
            experiences.push(new Experience(state, action, reward, state2));
        }

        return experiences;
    }
}