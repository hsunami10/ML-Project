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
}