class InterfaceEvents {
    attach(event, callback) {
        if (typeof this[event] !== "function") {
            this[event] = callback;
        } else throw new Error("Can't attach nonexistent event!");
    }
    onJoinGame() { }
    onJoin() { }
    onAnswer() { }
    onQuestionEnd() { }
    onQuestionSubmit() { }
    onQuestionStart() { }
    onLoad() { }
    constructor(parent) {
        this.parent = parent;
    }
}